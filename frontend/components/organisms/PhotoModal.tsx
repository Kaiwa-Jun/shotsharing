import React from "react";

interface PhotoModalProps {
  showModal: number | null;
  photoId: number;
  toggleModal: (photoId: number) => void;
  setDeleteModalId: (photoId: number | null) => void;
  setEditModalId: (photoId: number | null) => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  showModal,
  photoId,
  toggleModal,
  setDeleteModalId,
  setEditModalId,
}) => {
  if (showModal !== photoId) return null;

  return (
    <div className="absolute top-8 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow py-2">
      <p
        className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
        onClick={(event) => {
          event.stopPropagation();
          toggleModal(photoId);
          setEditModalId(photoId);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>
        投稿を編集
      </p>
      <p
        className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 flex items-center"
        onClick={(event) => {
          event.stopPropagation();
          setDeleteModalId(photoId);
          toggleModal(null);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
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
  );
};

export default PhotoModal;
