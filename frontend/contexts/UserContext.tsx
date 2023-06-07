import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types/user";
import { firebaseAuth } from "../lib/auth";
interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

const useAuth = () => {
  return useContext(UserContext);
};

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken(true); // IDトークンを取得
          const user: User = {
            firebase_uid: firebaseUser.uid,
            display_name: firebaseUser.displayName,
            email: firebaseUser.email,
            avatar_url: firebaseUser.photoURL,
            idToken: idToken, // 追加
          };
          setUser(user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useAuth };
