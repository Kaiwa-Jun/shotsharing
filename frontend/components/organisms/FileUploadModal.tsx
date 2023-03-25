import Image from "next/image";
import React, { useState } from "react";

type FileUploadModalProps = {
  onClose: () => void;
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostButtonClick = () => {
    // ここで画像をバックエンドに送信する処理を実装
  };

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50 "
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 w-[500px] h-[400px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="flex flex-col items-center justify-center">
          {selectedImage ? (
            <Image
              className="h-auto max-w-full"
              src={selectedImage}
              alt="Selected image"
              style={{ width: "200px", height: "100px" }}
            />
          ) : (
            <Image
              className="h-auto max-w-full"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="image description"
              width={200}
              height={100}
            />
          )}

          <input
            className="block w-[350px] mb-0 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="small_size"
            type="file"
            onChange={handleImageChange}
          />

          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            SVG, PNG, JPG or GIF (MAX. 800x400px).
          </p>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              // checked={true}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              撮影場所を共有する
            </span>
          </label>
          <button onClick={handlePostButtonClick}>投稿</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
