// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
// https://firebase.google.com/docs/web/setup#available-libraries
import '../Forms/handleForm';

import { app as firebase } from './config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  FieldValue,
} from 'firebase/firestore/lite';

import { Notify } from 'notiflix';
import { signedUserUI } from './signedUserUI';
import { unsignedUserUI } from './unsignedUserUI';
import { closeModalStart } from '../modal-start';

Notify.init({
  position: 'center-top',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebase);

const signUpForm = document.querySelector('.form-sign-up');
const signInForm = document.querySelector('.form-sign-in');
const logOutBtn = document.querySelector('.btn-logout');
const logOutBtnMobile = document.querySelector('.mobile-btn-log');

signUpForm.addEventListener('submit', handleSignUp);
signInForm.addEventListener('submit', handleSignIn);
logOutBtn.addEventListener('click', signOutUser);
logOutBtnMobile.addEventListener('click', signOutUser);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('user logged in');
    console.log(user.uid);

    signedUserUI();
    return;
  }

  unsignedUserUI();
  console.log('user not logged in');
});

const signUpUser = async () => {
  const email = inputEmail.value;
  const password = inputPassword.value;

  const user = await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      console.log(userCredential);
      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

function handleSignUp(e) {
  e.preventDefault();

  const name = signUpForm.elements.name.value;
  const email = signUpForm.elements.email.value;
  const password = signUpForm.elements.password.value;

  console.log(name, email, password);

  signUp(email, password, name);
}

function handleSignIn(e) {
  e.preventDefault();

  // const name = signInForm.elements.name.value;
  const email = signInForm.elements.email.value;
  const password = signInForm.elements.password.value;

  console.log(name, email, password);

  signIn(email, password);
}

export function signUp(email, password, username) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Handle successful sign-up
      const user = userCredential.user;

      try {
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, { email, username });
      } catch (error) {
        console.log(error);
      }

      Notify.success('Signed up!');
      closeModalStart();
    })
    .catch(error => {
      // Handle sign-up error
      // console.log('Sign-up error:', error.code);
      Notify.failure(error.code);
    });
}

export function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Handle successful sign-in
      const user = userCredential.user;
      // console.log('Signed In:', user);
      Notify.success('Signed In!');
      closeModalStart();
    })
    .catch(error => {
      // Handle sign-up error
      console.log('Sign-up error:', error);
      Notify.failure(error.code);
    });
}

export function signOutUser() {
  signOut(auth)
    .then(() => {
      Notify.success('Logged Out!');
    })
    .catch(error => {
      Notify.failure(error.code);
      // console.error('Logout error:', error);
    });
}

// firestore -----------------------------------------

// Get a list of books from your database
const db = getFirestore(firebase);

export async function addBookToFirestore(bookInfo) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);

    // Check if the document exists
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      // Check if the 'books' field exists
      const userData = userDoc.data();
      if (userData.books) {
        // Update the 'books' field using arrayUnion
        await updateDoc(userRef, {
          books: arrayUnion(bookInfo),
        });
      } else {
        // Create the 'books' field and set it as an array containing the book name
        await setDoc(
          userRef,
          {
            books: [bookInfo],
          },
          { merge: true }
        );
      }
      console.log('Book added to shopping list:', bookInfo);
    } else {
      // Create the user document and add the book to the 'books' field
      await setDoc(userRef, {
        books: [bookInfo],
      });
      console.log(
        'New user document created with book added to shopping list:',
        bookInfo
      );
    }
  }
}

export async function removeBookFromFirestore(book) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);

    updateDoc(userRef, {
      books: firebase.firestore.FieldValue.arrayRemove(book),
    })
      .then(() => {
        console.log('Book removed from shopping list:', book);
      })
      .catch(error => {
        console.error('Error removing book from shopping list:', error);
      });
  }
}

export async function removeBookFromShoppingList(bookId) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);

    const userDoc = await doc.get(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedBooks = userData.books.filter(book => book._id !== bookId);

      await updateDoc(userRef, {
        books: updatedBooks,
      });

      console.log('Book removed from shopping list:', bookId);
    } else {
      console.error('User document does not exist');
    }
  }
}

export function removeBookById(bookId) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);

    getDoc(userRef)
      .then(userDoc => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const books = userData.books || [];

          books.forEach(book => {
            if (book.id === bookId) {
              removeBookFromShoppingList(bookId);
            }
          });
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }
}
