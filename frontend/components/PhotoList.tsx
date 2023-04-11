import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getPhotos } from "../utils/api";
import { usePhotoContext } from "../contexts/PhotoContext";

interface Photo {
  id: number;
  file_url: string;
  image_blob: {
    filename: string;
  };
  camera_model: string;
  shutter_speed: string;
  iso: number;
  f_value: number;
  created_at: string;
}

interface PhotoListProps {
  photos?: Photo[];
}

function PhotoList({ photos = [] }: PhotoListProps): JSX.Element {
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [fixedHeight, setFixedHeight] = useState<number>(300);
  const [showModal, setShowModal] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const imageRatio = 4 / 3; // 画像の縦横比
      const height = fixedHeight;
      const width = Math.round(height * imageRatio);
      setImageWidth(width > screenWidth ? screenWidth : width);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleModal = (photoId: number) => {
    setShowModal(showModal === photoId ? null : photoId);
  };

  return (
    <div className="flex flex-wrap justify-start items-start">
      {photos.map((photo: Photo) =>
        !photo ? null : (
          <div
            key={photo.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2"
            style={{ width: imageWidth }}
          >
            {photo.file_url ? (
              <a href={`/photo/${photo.id}`}>
                <div
                  className="relative rounded-t-lg"
                  style={{ height: fixedHeight }}
                >
                  <Image
                    className="absolute top-0 left-0 rounded    t-lg"
                    src={photo.file_url}
                    alt="Uploaded photo"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    priority
                  />
                </div>
              </a>
            ) : (
              <div>No image available</div>
            )}
            <div className="relative">
              <div
                className="bg-white rounded-full w-8 h-8 absolute top-0 right-4 flex items-center justify-center cursor-pointer"
                onClick={() => toggleModal(photo.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </div>
              {showModal === photo.id && (
                <div className="absolute top-8 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow py-2">
                  <p
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleModal(photo.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                    投稿を編集
                  </p>
                  <p
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 flex items-center"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteModalId(photo.id);
                      setShowModal(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    投稿を削除
                  </p>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-gray-500">
                {new Date(photo.created_at).toLocaleString()}
              </p>
              <p className="text-gray-900">カメラ: {photo.camera_model}</p>
              <p className="text-gray-900">ISO: {photo.iso}</p>
              <p className="text-gray-900">F値: {photo.f_value}</p>
              <p className="text-gray-900">
                シャッタースピード: {photo.shutter_speed}
              </p>
            </div>
          </div>
        )
      )}
      {deleteModalId !== null && (
        <div
          id="popup-modal"
          tabindex="-1"
          class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-md max-h-full mx-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={() => {
                  setDeleteModalId(null);
                }}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg
                  aria-hidden="true"
                  className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  本当にこの投稿を削除して
                  <br />
                  よろしいですか？
                </h3>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 mr-6"
                  onClick={() => {
                    setDeleteModalId(null);
                  }}
                >
                  キャンセル
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center "
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoList;
