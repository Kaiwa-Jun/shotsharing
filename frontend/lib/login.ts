import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { googleProvider } from "./firebaseConfig";

const auth = getAuth();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};
