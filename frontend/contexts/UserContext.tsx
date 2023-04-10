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
    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          firebase_uid: firebaseUser.uid,
          display_name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar_url: firebaseUser.photoURL,
        };
        setUser(user);
      } else {
        setUser(null);
      }
    });

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
