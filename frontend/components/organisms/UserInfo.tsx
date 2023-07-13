import React, { useEffect, useState } from "react";
import "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Image from "next/image";
import {
  updateUserName,
  updateUserProfileImage,
  updateBackendUser,
} from "../../utils/api"; // 関数をインポート
import { useAuth } from "../../contexts/UserContext";
import { User } from "../../types/user";

const convertFirebaseUserToUser = async (
  firebaseUser: firebase.User | null
): Promise<User | null> => {
  if (!firebaseUser) return null;

  const idToken = await firebaseUser.getIdToken(true);
  return {
    firebase_uid: firebaseUser.uid,
    display_name: firebaseUser.displayName || "",
    email: firebaseUser.email || "",
    avatar_url: firebaseUser.photoURL || "",
    idToken: idToken || "",
  };
};

const UserInfo = () => {
  const { user, setUser } = useAuth();
  // const [user, setUser] = useState<firebase.User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null); // ユーザーネームの状態を追跡するための新しい状態変数
  const [imageUpdated, setImageUpdated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: firebase.User | null) => {
        const user = await convertFirebaseUserToUser(firebaseUser);
        setUser(user);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSaveClick = async () => {
    if (user && (username || selectedImage)) {
      try {
        // ユーザー名を更新
        let updatedUsername = user.display_name;
        if (username) {
          await updateUserName(user.firebase_uid, username);
          updatedUsername = username;
        }
        // プロフィール画像を更新
        let imageUrl = user.avatar_url;
        if (selectedImage) {
          const selectedFile = dataURItoBlob(selectedImage);
          imageUrl = await updateUserProfileImage(
            user.firebase_uid,
            selectedFile
          ); // アップロードした画像のURLを取得

          // Update the user's profile image
          await firebase.auth().currentUser?.updateProfile({
            photoURL: imageUrl,
          });
        }

        // ここでバックエンドのユーザー情報も更新
        if (user && username && imageUrl && user.idToken) {
          await updateBackendUser(
            user.firebase_uid,
            username,
            imageUrl,
            user.idToken
          );
        }

        // ここで再度ユーザー情報を取得して、状態を更新
        const firebaseUser = firebase.auth().currentUser;
        const updatedUser = await convertFirebaseUserToUser(firebaseUser);
        setUser(updatedUser); // 共有のユーザー情報を更新
      } catch (error) {
        alert(`ユーザー情報の更新に失敗しました: ${(error as Error).message}`);
      }
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (imageUpdated) {
      setModalOpen(false);
      setImageUpdated(false); // 状態をリセット
    }
  }, [imageUpdated]);

  function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center my-7">
        <div className="flex items-center justify-center mb-3">
          <div className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-3">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
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
              {user?.display_name || "ユーザーネーム"}
            </p>
          </div>
        </div>

        {/* プロフィール編集のモーダル */}

        <button
          onClick={() => setModalOpen(true)}
          type="button"
          className="py-2.5 px-5 mt-1  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-600 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          プロフィールを編集
        </button>

        <div
          id="defaultModal"
          tabIndex={-1}
          aria-hidden="true"
          className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50 ${
            isModalOpen ? "block" : "hidden"
          }`}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-lg shadow dark:bg-gray-700"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                  プロフィール編集
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ユーザー名
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="username"
                      className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={user?.display_name || "ユーザーネーム"}
                      onChange={handleUsernameChange} // 入力値が変更されたときにハンドラを呼び出す
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="user_avatar"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    プロフィール画像
                  </label>
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-3">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="absolute w-full h-full object-cover"
                        />
                      ) : user?.avatar_url ? (
                        <Image
                          src={user.avatar_url}
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
                    <input
                      type="file"
                      id="user_avatar"
                      onChange={handleImageChange}
                      className="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="defaultModal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleSaveClick} // ボタンがクリックされたときにハンドラを呼び出す
                >
                  編集を保存
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  data-modal-hide="defaultModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
