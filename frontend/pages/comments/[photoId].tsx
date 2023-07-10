import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getPhotoById, postComment } from "../../utils/api";
import { getComments } from "../../utils/api";
import { Photo } from "../../types/photo";
import { Comment } from "../../types/comment";
import HeroSection from "../../components/organisms/HeroSection";
import Image from "next/image";
import { useAuth } from "../../contexts/UserContext";

interface CommentPageProps {
  initialPhoto: Photo | null;
}

const CommentPage: React.FC<CommentPageProps> = ({ initialPhoto }) => {
  const { user } = useAuth();
  const [photo, setPhoto] = useState<Photo | null>(initialPhoto);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const fixedHeight = 300; // 画像の高さを固定
  const router = useRouter();
  const { photoId } = router.query;

  const aspectRatio =
    photo && photo.height && photo.width ? photo.height / photo.width : 1;

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setImageWidth(screenWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [photo, fixedHeight]);

  useEffect(() => {
    if (!initialPhoto && photoId) {
      getPhotoById(photoId).then((photo) => setPhoto(photo));
    }
  }, [photoId, initialPhoto]);

  useEffect(() => {
    if (photo) {
      getComments(photo.id).then((comments) => {
        console.log(comments); // ここでAPIのレスポンスをログ出力
        setComments(comments);
      });
    }
  }, [photo]);

  if (!photo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="my-20">
        <div className="flex items-center justify-center my-5">
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <Image
              src={
                photo.user && photo.user.avatar_url
                  ? photo.user.avatar_url
                  : "/path/to/default/avatar.png"
              }
              alt="User avatar"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="py-1 ml-6 text-2xl">
            <p className="text-gray-900">
              {photo.user ? photo.user.display_name : "Loading..."}
            </p>
          </div>
        </div>
        <div className="flex flex-row-reverse justify-center mx-auto max-w-screen-lg">
          <div className="p-4 w-1/4">
            <p className="text-gray-900">カメラ: {photo.camera_model}</p>
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
          <div className="w-1/4">
            <div
              className="relative"
              style={{ width: `${100 * aspectRatio}%`, height: fixedHeight }}
            >
              <Image
                src={photo.file_url}
                alt="Uploaded photo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            {/* <p className="            text-gray-500">
              {new Date(photo.created_at).toLocaleString()}
            </p> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* ここにコメント内容を表示 */}
        <ul
          role="list"
          className="w-full max-w-lg divide-y divide-gray-200 dark:divide-gray-700"
        >
          {comments.map((comment, index) => (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image
                    className="w-8 h-8 rounded-full"
                    src={
                      comment.user && comment.user.avatar_url
                        ? comment.user.avatar_url
                        : "/path/to/default/avatar.png"
                    }
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                    {comment.user ? comment.user.display_name : "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {comment.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* コメント入力フォーム */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (user && user.idToken) {
              // user.display_name や user.avatar_url が null の場合にはデフォルト値を使用
              const displayName = user.display_name || "Anonymous";
              const avatarUrl = user.avatar_url || "/default_avatar.svg";
              postComment(
                comment,
                photo.id,
                user.idToken,
                displayName,
                avatarUrl
              ).then((newComment) => {
                setComment("");
                setComments([...comments, newComment]);
              });
            }
          }}
          className="w-full max-w-lg flex flex-col my-8"
        >
          <div className="mb-2">
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="コメントを入力..."
              required
              maxLength={30}
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              コメントを投稿
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const photoId = context.params?.photoId;

  if (!photoId || typeof photoId !== "string") {
    return { notFound: true };
  }

  const photo = await getPhotoById(photoId);

  return {
    props: {
      initialPhoto: photo,
    },
  };
};

export default CommentPage;
