import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import { createConsumer } from "@rails/actioncable";
import ActionCable from "actioncable";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { deletePhoto } from "../utils/api/deletePhoto";
import { useRouter } from "next/router";
import { Photo } from "../types/photo";
import firebase from "firebase/compat/app";
import {
  createLike,
  deleteLike,
  getLike,
  getComments,
  getLikesCount,
} from "../utils/api";
interface PhotoListProps {
  photos?: Photo[];
}

interface Module {
  default: {
    createConsumer: (url: string) => any;
  };
}

function PhotoList({ photos = [] }: PhotoListProps): JSX.Element {
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [fixedHeight, setFixedHeight] = useState<number>(300);
  const [showModal, setShowModal] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<
    Record<number, boolean>
  >({});
  const [editModalId, setEditModalId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [imageRatios, setImageRatios] = useState<Record<number, number>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [cable, setCable] = useState<any>(null);
  const LoadableActionCable = loadable(() => import("@rails/actioncable"));

  interface LikeData {
    photo_id: number;
    likes_count: number;
  }

  const ActionCable = dynamic(() => import("@rails/actioncable"), {
    ssr: false,
  });

  useEffect(() => {
    const cable = createConsumer(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cable`
    );
    setCable(cable);
  }, []);

  useEffect(() => {
    if (!cable) return;

    const subscription = cable.subscriptions.create("LikesChannel", {
      received: (data: LikeData) => {
        if (data.photo_id in likes) {
          setLikeCounts((prev) => ({
            ...prev,
            [data.photo_id]: data.likes_count,
          }));
        }
      },
    });
    return () => {
      cable.subscriptions.remove(subscription);
    };
  }, [cable, likes]);

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
  }, [fixedHeight]);

  const toggleModal = (photoId: number) => {
    setShowModal(showModal === photoId ? null : photoId);
  };

  const handleImageLoad = (id: number, event: any) => {
    const { width, height } = event.target;
    setImageRatios((prevRatios) => ({
      ...prevRatios,
      [id]: width / height,
    }));
  };

  const onDelete = async () => {
    if (deleteModalId) {
      // バックエンドで削除処理を実行
      await deletePhoto(deleteModalId);
      // モーダルを閉じる
      setDeleteModalId(null);
      // フロントエンドで削除処理を実行
      router.reload();
    }
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        setCurrentUserId(user ? user.uid : null);
        console.log("currentUserId:", user ? user.uid : null);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts: Record<number, number> = {};
      for (const photo of photos) {
        const comments = await getComments(photo.id);
        counts[photo.id] = comments.length;
      }
      setCommentCounts(counts);
    };
    fetchCommentCounts();
  }, [photos]);

  const handleLikeClick = async (photoId: number) => {
    if (!currentUserId) return;
    const idToken = await firebase.auth().currentUser?.getIdToken();
    if (!idToken) return;

    try {
      const likeExists = await getLike(photoId, idToken);
      // console.log(`getLike returned: ${likeExists}`);

      if (likeExists) {
        await deleteLike(photoId, idToken);
      } else {
        await createLike(photoId, idToken);
        console.log(`Successfully created like for photoId: ${photoId}`);
      }

      setLikes((prevLikes) => {
        const updatedLikes = {
          ...prevLikes,
          [photoId]: !likeExists,
        };
        console.log(`Updated likes state: ${JSON.stringify(updatedLikes)}`);
        return updatedLikes;
      });
    } catch (error) {
      console.error(`Error updating like for photoId: ${photoId}`, error);
      alert("いいねの更新に失敗しました");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      if (!currentUserId) return;
      const idToken = await firebase.auth().currentUser?.getIdToken();
      if (!idToken) return;
      const likes: Record<number, boolean> = {};
      for (const photo of photos) {
        console.log(`Fetching like for photoId: ${photo.id}`);
        try {
          const likeExists = await getLike(photo.id, idToken);
          // console.log(`getLike returned: ${likeExists}`);
          likes[photo.id] = likeExists;
        } catch (error) {
          console.error(error);
        }
      }
      setLikes(likes);
      console.log(likes);
    };
    fetchLikes();
  }, [photos, currentUserId]);

  useEffect(() => {
    console.log(`Photos state: ${JSON.stringify(photos)}`);
    const fetchLikeCounts = async () => {
      try {
        const counts: Record<number, number> = {};
        const idToken = await firebase.auth().currentUser?.getIdToken();
        if (!idToken) return;
        for (const photo of photos) {
          const likes = await getLikesCount(photo.id, idToken); // いいねの数を取得する関数
          counts[photo.id] = likes; // 修正: likes.length -> likes
        }
        setLikeCounts(counts);
        // console.log(`Updated likeCounts state: ${JSON.stringify(counts)}`);
      } catch (error) {
        console.error(`Error in fetchLikeCounts: ${error}`);
      }
    };
    fetchLikeCounts();
  }, [photos, likes]); // likesを依存配列に追加

  useEffect(() => {
    photos.forEach((photo) => {
      console.log("photo.location_enabled:", photo.location_enabled);
    });
  }, [photos]);

  function MyComponent() {
    const [ActionCable, setActionCable] = useState<Module | null>(null);

    useEffect(() => {
      LoadableActionCable.load().then((module: Module) => {
        setActionCable(module);
      });
    }, []); // LoadableActionCableを依存配列から削除

    useEffect(() => {
      if (ActionCable) {
        const cable = ActionCable.default.createConsumer(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/cable`
        );
        // ここでcableを使用する
      }
    }, [ActionCable]);
    return <div>My Component</div>;
  }

  return (
    <div className="flex flex-wrap justify-center items-start">
      {photos
        .sort(
          (a: Photo, b: Photo) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((photo: Photo) =>
          !photo
            ? null
            : (console.log("photo.user:", photo.user),
              photo.user &&
                console.log(
                  "photo.user.firebase_uid:",
                  photo.user.firebase_uid
                ),
              (
                <div
                  key={photo.id}
                  className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2"
                  style={{
                    width: fixedHeight * (imageRatios[photo.id] || 1),
                  }}
                >
                  {photo.file_url ? (
                    <a href={`/photo/${photo.id}`}>
                      <div
                        className="relative rounded-t-lg"
                        style={{ height: fixedHeight }}
                      >
                        <Image
                          className="absolute top-0 left-0 rounded t-lg"
                          src={photo.file_url}
                          alt="Uploaded photo"
                          width={500}
                          height={300}
                          objectFit="cover"
                          objectPosition="center"
                          priority
                          onLoad={(event) => handleImageLoad(photo.id, event)}
                        />
                      </div>
                    </a>
                  ) : (
                    <div>No image available</div>
                  )}
                  <div className="relative flex justify-end">
                    {/* いいねアイコン */}
                    <div className="flex items-center mr-2">
                      <div
                        className="bg-white rounded-full w-8 h-8 mr-2 flex items-center justify-center cursor-pointer"
                        onClick={() => handleLikeClick(photo.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={(() => {
                            console.log(likes[photo.id]);
                            return likes[photo.id] ? "red" : "none";
                          })()}
                          stroke={likes[photo.id] ? "red" : "currentColor"}
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </div>
                      <p className="ml-0">
                        {likeCounts[photo.id] ? likeCounts[photo.id] : 0}
                      </p>
                    </div>

                    {/* コメントアイコン */}
                    <Link href={`/comments/${photo.id}`}>
                      <div className="flex items-center mr-2">
                        <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                          </svg>
                        </div>
                        <p className="ml-0">
                          {commentCounts[photo.id]
                            ? commentCounts[photo.id]
                            : 0}
                        </p>
                      </div>
                    </Link>

                    {/* 位置情報アイコン */}
                    {/* photo.location_enabled && (
                        <Link href={`/photo/${photo.id}`}>
                          <div className="flex items-center mr-2">
                            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ) */}

                    {/* モーダル */}
                    {photo.user &&
                      photo.user.firebase_uid === currentUserId && (
                        <div
                          className="bg-white rounded-full w-8 h-8 mr-1  flex items-center justify-center cursor-pointer"
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
                      )}
                    {showModal === photo.id && (
                      <div className="absolute top-8 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow py-2">
                        {/* <p
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          // onClick={(event) => {
                          //   event.stopPropagation();
                          //   toggleModal(photo.id);
                          //   setEditModalId(photo.id);
                          // }}
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
                        </p> */}
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
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500">
                      {new Date(photo.created_at).toLocaleString()}
                    </p>
                    <p className="text-gray-900">
                      カメラ: {photo.camera_model}
                    </p>
                    <p className="text-gray-900">ISO: {photo.iso}</p>
                    <p className="text-gray-900">F値: {photo.f_value}</p>
                    <p className="text-gray-900">
                      シャッタースピード: {photo.shutter_speed}
                    </p>
                    <p className="text-gray-900">
                      撮影日:{" "}
                      {new Date(photo.taken_at).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))
        )}
      {deleteModalId !== null && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
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
                  onClick={onDelete}
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
      {editModalId !== null && (
        <div
          id="edit-modal"
          tabIndex={-1}
          className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div
            className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 fadeIn"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 w-[500px] h-[450px] transition-all duration-300 ease-in-out transform">
              <button
                type="button"
                onClick={() => {
                  setEditModalId(null);
                }}
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
                  // onChange={handleImageChange}
                />

                <label className="relative inline-flex items-center cursor-pointer mt-5">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    撮影場所を共有する
                  </span>
                </label>
                <div className="flex mt-10">
                  <button
                    onClick={() => {
                      setEditModalId(null);
                    }}
                    type="button"
                    className="py-2.5 px-5 mr-6 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    編集を保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoList;
