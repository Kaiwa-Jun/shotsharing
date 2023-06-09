import React, { useState } from "react";
import AuthModal from "@/components/organisms/AuthModal";
import { signOut } from "@/lib/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import FileUploadModal from "./organisms/FileUploadModal";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePhotoContext } from "../contexts/PhotoContext";
import { useAuth } from "../contexts/UserContext"; // 追加: useAuthをインポート

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

const Header: React.FC = () => {
  const { user } = useAuth(); // 変更: useAuthからuserを取得
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const router = useRouter();
  const { addPhoto, handleImageUpload } = usePhotoContext();

  const handleUploadButtonClick = () => {
    setShowUploadModal(true);
  };

  // 検索ボタンのクリックイベントハンドラー
  const handleSearchButtonClick = () => {
    router.push("/search");
  };

  return (
    <header>
      <nav
        className="fixed w-full z-10 bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:text-white"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image
                // src="https://flowbite.com/docs/images/logo.svg"
                src="/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
                width={50}
                height={50}
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-black">
                ShotSharing
              </span>
            </div>
          </Link>

          <div className="flex items-center lg:order-2">
            {user ? (
              <>
                <button
                  onClick={handleUploadButtonClick}
                  className="text-gray-800 dark:text-black hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 sm:px-4 py-2 sm:py-2.5 mr-1 sm:mr-2 dark:hover:bg-gray-200 focus:outline-none dark:focus:ring-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                {showUploadModal && (
                  <FileUploadModal
                    onClose={() => setShowUploadModal(false)}
                    onImageUpload={(photo: any) => {
                      handleImageUpload(photo);
                      // router.reload();
                    }}
                  />
                )}

                <button
                  onClick={handleSearchButtonClick}
                  className="text-gray-800 dark:text-black hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 sm:px-4 py-2 sm:py-2.5 mr-1 sm:mr-2 dark:hover:bg-gray-200 focus:outline-none dark:focus:ring-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  hover:bg-gray-50"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
                    >
                      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
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
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/mypage/posts">
                              <div
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm cursor-pointer"
                                )}
                              >
                                {user?.display_name || "ユーザーネーム"}
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      {/* <div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/mypage/edit">
                              <div
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm cursor-pointer"
                                )}
                              >
                                プロフィール編集
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                      </div> */}
                      <div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/mypage/likes"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              いいねした投稿
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/mypage/comments"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              コメントした投稿
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      {/* <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              お気にいりした投稿
                            </a>
                          )}
                        </Menu.Item>
                      </div> */}
                      <div>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={signOut}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-red-400"
                                  : "text-red-400",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              ログアウト
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <button
                  onClick={handleSearchButtonClick}
                  className="text-gray-800 dark:text-black hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-200 focus:outline-none dark:focus:ring-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-white dark:text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-800 font-medium rounded-lg text-sm px-2 sm:px-4 py-2 sm:py-2.5 mr-1 sm:mr-2 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-gray-100"
                >
                  ログイン
                </button>
                {showModal && <AuthModal onClose={() => setShowModal(false)} />}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
