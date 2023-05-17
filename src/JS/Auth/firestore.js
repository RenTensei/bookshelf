import { getFirestore } from 'firebase/firestore';
import { app as firebase } from './config';

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
