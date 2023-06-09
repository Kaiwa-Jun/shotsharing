import { signInWithGoogle } from "../../lib/auth";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../contexts/UserContext";
import { auth } from "../../lib/firebaseConfig";
import { useState } from "react";

type AuthModalProps = {
  onClose: () => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { setUser } = useAuth();
  const [buttonImage, setButtonImage] = useState(
    "/btn_google_signin_light_normal_web@2x.png"
  );

  const handleGoogleSignIn = async () => {
    console.log("handleGoogleSignIn called");
    try {
      await signInWithGoogle(setUser);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50"
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
        <div className="flex flex-col items-center justify-center my-14">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
              width={50}
              height={50}
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-black">
              ShotSharing
            </span>
          </Link>
          <div
            className="mt-14 border-2 border-none rounded-sl inline-block"
            onMouseEnter={() =>
              setButtonImage("/btn_google_signin_light_focus_web@2x.png")
            }
            onMouseLeave={() =>
              setButtonImage("/btn_google_signin_light_normal_web@2x.png")
            }
            onMouseDown={() =>
              setButtonImage("/btn_google_signin_light_pressed_web@2x.png")
            }
            onMouseUp={() =>
              setButtonImage("/btn_google_signin_light_normal_web@2x.png")
            }
            onClick={handleGoogleSignIn}
          >
            <Image
              src={buttonImage}
              alt="Google sign-in icon"
              width={240}
              height={40}
            />
          </div>

          <p className="text-black w-2/3 mx-auto my-10">
            <Link
              href="/terms-of-service"
              onClick={onClose}
              className="text-blue-500 hover:underline"
            >
              利用規約
            </Link>
            、
            <Link
              href="/privacy-policy"
              onClick={onClose}
              className="text-blue-500 hover:underline"
            >
              プライバシーポリシー
            </Link>
            に同意した上でログインしてください
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
