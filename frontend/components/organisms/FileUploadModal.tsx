import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
// import { Photo } from "../../contexts/PhotoContext";
import { Photo } from "../../types/photo";
import firebase from "firebase/compat/app";
import TwitterShareButton from "./TwitterShareButton";
import { text } from "stream/consumers";
import { usePhotoContext } from "@/contexts/PhotoContext";

type FileUploadModalProps = {
  onClose: () => void;
  onImageUpload: (photo: any) => void;
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  onClose,
  onImageUpload,
}) => {
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserToken, setCurrentUserToken] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isUploadFinished, setIsUploadFinished] = useState<boolean | null>(
    null
  );
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [showTwitterButton, setShowTwitterButton] = useState(false);
  const { addPhoto } = usePhotoContext();
  const [uploadState, setUploadState] = useState<{
    isFinished: boolean;
    photo: Photo | null;
  }>({ isFinished: false, photo: null });
  const [showUploadModal, setShowUploadModal] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    setUser(user);
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        setCurrentUserId(user ? user.uid : null);
        // console.log("currentUserId:", user ? user.uid : null);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const fetchToken = async () => {
        const token = await user.getIdToken();
        setCurrentUserToken(token);
      };
      fetchToken();
    }
  }, [user]);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          const blob = dataURLtoBlob(result);
          setSelectedImage(blob);
        }
      };
    }
  };

  const handlePostButtonClick = async () => {
    try {
      setIsLoading(true);
      console.log("setIsLoading called");
      if (selectedFile && user) {
        console.log("selectedFile and user are available");
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("user_id", user.uid);
        formData.append("location_enabled", String(locationEnabled));
        if (locationEnabled && currentLocation) {
          formData.append("latitude", String(currentLocation.latitude));
          formData.append("longitude", String(currentLocation.longitude));
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentUserToken}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        console.log("Data before creating photo object:", data);

        if (response.ok) {
          const photo: Photo = {
            id: data.id,
            file_url: data.url,
            image_blob: {
              filename: data.filename,
            },
            camera_model: data.camera_model || "",
            shutter_speed: data.shutter_speed || "",
            iso: data.iso || 0,
            f_value: data.f_value || 0,
            created_at: data.created_at || "",
            taken_at: data.taken_at,
            user: data.user,
            categories: data.categories,
            location_enabled: data.location_enabled,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
          };
          console.log("photo object after fetch: ", photo);
          onImageUpload(photo);
          setIsLoading(false);
          console.log("photo:", photo); // photo の内容をログに出力
          console.log(
            "photo.file_url:",
            photo ? photo.file_url : "photo or photo.file_url is undefined"
          );
          console.log("uploadState before setUploadState", uploadState); // 追加
          setUploadState({ isFinished: true, photo }); // ここで photo を設定
          console.log("uploadState after setUploadState", uploadState); // 追加
          // addPhoto(photo);
          setShowUploadModal(false);
        } else {
          console.error(data);
          // setIsLoading(false);
          setIsUploadFinished(false);
        }
      } else {
        console.error("File or user is missing");
        // setIsLoading(false);
      }
      // setIsLoading(false);
    } catch (error) {
      console.error("Error in handlePostButtonClick:", error);
      setIsUploadFinished(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    const modalBackground = document.querySelector(
      ".fixed.z-10.inset-0.overflow-y-auto.flex.items-center.justify-center.bg-gray-500.bg-opacity-50"
    );
    const modal = document.querySelector(
      ".relative.bg-white.rounded-lg.shadow.dark\\:bg-gray-800.sm\\:p-5.w-\\[500px\\].h-\\[450px\\]"
    );

    if (modalBackground && modal) {
      modalBackground.classList.add("bg-opacity-0");
      modal.classList.add("-translate-y-4", "opacity-0");
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const file = selectedImage ? selectedImage : null;

  // useEffect(() => {
  //   if (isUploadFinished === true && photo !== null) {
  //     setShowTwitterButton(true);
  //   } else {
  //     setShowTwitterButton(false);
  //   }
  // }, [isUploadFinished, photo]);

  useEffect(() => {
    console.log("uploadState changed to", uploadState); // uploadState の変更をログに出力

    if (uploadState.isFinished && uploadState.photo !== null) {
      console.log("Setting showTwitterButton to true");
      setShowTwitterButton(true);
    } else {
      console.log("Setting showTwitterButton to false");
      setShowTwitterButton(false);
    }
  }, [uploadState]);

  useEffect(() => {
    if (uploadState.isFinished && uploadState.photo) {
      addPhoto(uploadState.photo);
    }
  }, [uploadState, addPhoto]); // uploadState と addPhoto の変更を監視します。

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 fadeIn"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {isLoading ? (
        // ローディング中はローダーを表示
        <div className="flex flex-col items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-500">画像をアップロード中です</p>
        </div>
      ) : showTwitterButton ? (
        <>
          <TwitterShareButton
            url={
              uploadState.photo?.id
                ? `https://shotsharing.vercel.app/photo/${uploadState.photo.id}`
                : "https://shotsharing.vercel.app"
            }
            text="Twitterテスト投稿"
            onClose={() => setShowTwitterButton(false)}
          />
        </>
      ) : showUploadModal ? (
        <>
          {console.log("showTwitterButton:", showTwitterButton)}
          {console.log("TwitterShareButton url:", photo ? photo.file_url : "")}
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
              {selectedImage ? (
                <Image
                  className="max-h-[180px] h-auto max-w-full object-contain my-5"
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected image"
                  width={500}
                  height={300}
                />
              ) : (
                <Image
                  className="max-h-[180px] h-auto max-w-full object-contain my-5"
                  src="/upload-default.svg"
                  alt="Default image"
                  width={500}
                  height={300}
                />
              )}

              <input
                className="block w-[350px] mb-0 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="small_size"
                type="file"
                onChange={handleImageChange}
              />

              {/* <label className="relative inline-flex items-center cursor-pointer mt-5">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={locationEnabled}
                onChange={(e) => setLocationEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                撮影場所を共有する
              </span>
            </label> */}
              <div className="flex mt-10">
                <button
                  onClick={handleClose}
                  type="button"
                  className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  キャンセル
                </button>
                <button
                  onClick={handlePostButtonClick}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  投稿
                </button>
              </div>
            </div>
          </div>
          ))
        </>
      ) : null}
    </div>
  );
};

export default FileUploadModal;
