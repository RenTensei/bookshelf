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
} from 'firebase/firestore';

import { Notify } from 'notiflix';
import { signedUserUI } from './signedUserUI';
import { unsignedUserUI } from './unsignedUserUI';
import { closeModalStart } from '../modal-start';

import { signUpForm, signInForm, logOutBtn, logOutBtnMobile } from './refs';

import '../Forms/handleForm';
import './firestore';

Notify.init({
  position: 'center-top',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebase);

signUpForm.addEventListener('submit', handleSignUp);
signInForm.addEventListener('submit', handleSignIn);
logOutBtn.addEventListener('click', signOutUser);
logOutBtnMobile.addEventListener('click', signOutUser);

onAuthStateChanged(auth, user => {
  if (user) {
    console.log('user logged in');
    console.log(user.uid);

    signedUserUI();
    return;
  }

  unsignedUserUI();
  console.log('user not logged in');
});

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

function signUp(email, password, username) {
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

function signIn(email, password) {
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

function signOutUser() {
  signOut(auth)
    .then(() => {
      Notify.success('Logged Out!');
    })
    .catch(error => {
      Notify.failure(error.code);
      // console.error('Logout error:', error);
    });
}
