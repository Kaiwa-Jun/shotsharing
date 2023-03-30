import React from "react";
import { useEffect, useState } from "react";
import "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Image from "next/image";

const UserInfo = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        setUser(user);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      <div className="flex items-center justify-center my-7">
        <div className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              className="absolute w-full h-full object-cover"
              width={50}
              height={50}
            />
          ) : (
            <svg
              className="absolute w-12 h-12 text-gray-400 -left-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </div>
        <div className="py-1 ml-8 text-2xl">
          <p className=" text-gray-900">
            {user?.displayName || "ユーザーネーム"}
          </p>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
