import React, { useState } from "react";
import { updatePhoto } from "../../utils/api/updatePhoto";

interface EditModalProps {
  show: boolean;
  handleClose: () => void;
  editModalId: number | null;
  selectedImage: File | null;
  handleSave: (newImage: File | null) => void;
  selectedImageUrl: string;
}

const EditModal: React.FC<EditModalProps> = ({
  show,
  handleClose,
  editModalId,
  selectedImage,
  handleSave,
  selectedImageUrl,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(selectedImage);

  const imageURL = selectedFile
    ? URL.createObjectURL(selectedFile)
    : selectedImageUrl;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSaveClick = async () => {
    if (selectedFile && editModalId !== null) {
      // editModalId が null でないことを確認
      const formData = new FormData();
      formData.append("image", selectedFile);
      await updatePhoto(editModalId, formData);
    }
    handleSave(selectedFile);
    handleClose();
  };

  const imageSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : selectedImageUrl;

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 fadeIn ${
        !show && "hidden"
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 w-[500px] h-[450px] transition-all duration-300 ease-in-out transform">
        <button
          type="button"
          onClick={handleClose}
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
          <img
            className="max-h-[180px] h-auto max-w-full object-contain my-5"
            src={imageSrc}
            alt="Selected image"
          />

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

          <button
            onClick={handleSaveClick}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            編集を保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
