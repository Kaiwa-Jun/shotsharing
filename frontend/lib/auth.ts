import firebase, {
  auth as firebaseAuth,
  googleProvider,
} from "./firebaseConfig";
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import type { User } from "@/types/user";

const auth = getAuth();

const createUserInBackend = async (user: User) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      }
    );

    if (!response.ok) {
      throw new Error("ユーザーの作成に失敗しました");
    }
  } catch (error) {
    console.error(error);
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log("signInWithGoogle called");
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const firebaseUser = result.user;

    if (firebaseUser) {
      console.log("Firebase user found");
      const userSnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(firebaseUser.uid)
        .get();

      console.log("Before checking userSnapshot.exists");
      if (!userSnapshot.exists) {
        console.log("User not found in Firestore, creating new user");
        const newUser: User = {
          firebase_uid: firebaseUser.uid,
          display_name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar_url: firebaseUser.photoURL,
        };

        await firebase
          .firestore()
          .collection("users")
          .doc(firebaseUser.uid)
          .set(newUser);

        await createUserInBackend(newUser);
      } else {
        console.log("User found in Firestore");
      }
      console.log("After checking userSnapshot.exists");
    } else {
      console.log("Firebase user not found");
    }
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async () => {
  try {
    console.log("signOut called");
    await firebaseSignOut(firebaseAuth);
    console.log("signOut successful");
  } catch (error) {
    console.error(error);
  }
};

export { firebaseAuth };
