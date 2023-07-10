import React from "react";
import { FaTwitter } from "react-icons/fa";

interface TwitterShareButtonProps {
  url: string;
  text: string;
  via?: string;
  hashtags?: string[];
  onClose: () => void;
}

const TwitterShareButton: React.FC<TwitterShareButtonProps> = ({
  url,
  text,
  via,
  hashtags,
  onClose,
}) => {
  let shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(text)}`;

  if (via) {
    shareUrl += `&via=${via}`;
  }

  if (hashtags) {
    shareUrl += `&hashtags=${hashtags.join(",")}`;
  }

  const handleClose = () => {
    onClose();
    location.reload();
  };

  return (
    <>
      <div
        id="toast-message-cta"
        className="relative w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400"
        role="alert"
      >
        <div className="text-center mb-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            画像の投稿が完了しました！
          </span>
        </div>

        <div className="flex justify-center">
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center justify-center px-4 py-2 mb-2 text-white bg-twitter rounded hover:bg-twitter">
              <FaTwitter className="mr-2 text-white" />
              Twitterで共有する
            </button>
          </a>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-0 right-0 mt-2 mr-2 -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-message-cta"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
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
        </button>
      </div>
    </>
  );
};

export default TwitterShareButton;
