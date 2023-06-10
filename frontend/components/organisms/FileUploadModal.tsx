import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { Photo } from "../../contexts/PhotoContext";

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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

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
    if (file) {
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
    console.log("Current user:", user);

    if (selectedImage && user) {
      console.log("user.uid:", user.uid);

      try {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("user_id", user.uid);
        formData.append("location_enabled", String(locationEnabled));

        if (locationEnabled) {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                formData.append("latitude", String(position.coords.latitude));
                formData.append("longitude", String(position.coords.longitude));
                resolve(null);
              },
              (error) => {
                console.error("Error getting location:", error);
                if (error.code === error.PERMISSION_DENIED) {
                  alert(
                    "位置情報へのアクセスが許可されていません。設定を確認してください。"
                  );
                } else {
                  alert(
                    "位置情報を取得できませんでした。もう一度お試しください。"
                  );
                }
                reject(error);
              }
            );
          });
        }

        const idToken = await user.getIdToken(); // JWTを取得
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`, // JWTを含める
            },
            body: formData,
          }
        );
        const data = await response.json();
        if (response.status >= 200 && response.status < 300 && data.url) {
          const photo: Photo = {
            id: data.id,
            file_url: data.url,
            image_blob: {
              filename: data.filename, // 必要に応じて API から返された値をセットする
            },
            camera_model: data.camera_model || "",
            shutter_speed: data.shutter_speed || "",
            iso: data.iso || 0,
            f_value: data.f_value || 0,
            created_at: data.created_at || "", // 必要に応じて API から返された値をセットする
            taken_at: data.taken_at,
            user: data.user,
          };
          onClose();
          onImageUpload(photo);
        } else {
          console.log("Error response:", response);
          console.log("Error data:", data);
          alert("アップロードに失敗しました。もう一度お試しください。");
        }
      } catch (error) {
        // Handle the error
        alert("アップロード中にエラーが発生しました。もう一度お試しください。");
      }
    } else {
      alert("ログインしていないため、投稿できません。");
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

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 fadeIn"
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

          <label className="relative inline-flex items-center cursor-pointer mt-5">
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
          </label>
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
    </div>
  );
};

export default FileUploadModal;
