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
          Authorization: `Bearer ${user.idToken}`,
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

export const signInWithGoogle = async (
  setUser: (user: User | null) => void
) => {
  try {
    console.log("signInWithGoogle called");
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const firebaseUser = result.user;

    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken(true); // IDトークンを取得
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
          idToken: idToken,
        };

        await firebase
          .firestore()
          .collection("users")
          .doc(firebaseUser.uid)
          .set(newUser);

        console.log("User created in Firestore, checking...");
        const userCheckSnapshot = await firebase
          .firestore()
          .collection("users")
          .doc(firebaseUser.uid)
          .get();

        if (!userCheckSnapshot.exists) {
          console.error("Failed to create user in Firestore");
        } else {
          console.log("User successfully created in Firestore");
        }

        await createUserInBackend(newUser);
      } else {
        console.log("User found in Firestore");
        const user: User = userSnapshot.data() as User; // Get user data from the snapshot
        user.idToken = idToken; // 既存ユーザーでもトークンを更新
        setUser(user); // Set the user data in the UserContext
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
