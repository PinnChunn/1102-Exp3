import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHV6TxQUYqY1QWmH3x0HNYZrZrHqZUtPY",
  authDomain: "exp3-auth.firebaseapp.com",
  projectId: "exp3-auth",
  storageBucket: "exp3-auth.appspot.com",
  messagingSenderId: "813084126643",
  appId: "1:813084126643:web:4d8b9f8b8b8b8b8b8b8b8b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      user: {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL
      },
      error: null
    };
  } catch (error) {
    return {
      user: null,
      error: 'Failed to sign in with Google'
    };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: 'Failed to sign out' };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL
        });
      } else {
        resolve(null);
      }
    });
  });
};