import React, { useEffect, useState } from "react";
import PhotoList from "../PhotoList";
import { getLikedPhotos } from "../../utils/api";
import { useAuth } from "../../contexts/UserContext";
import { Photo } from "../../types/photo";

const MyLikes: React.FC = () => {
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const { user } = useAuth();

  console.log("user", user);
  useEffect(() => {
    if (user) {
      console.log("firebase_uid in Mylikes", user?.firebase_uid);
      getLikedPhotos(user.firebase_uid)
        .then((photos) => {
          setLikedPhotos(photos);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        {user ? (
          <PhotoList photos={likedPhotos} />
        ) : (
          <p>ログインしているユーザーの情報がありません。</p>
        )}
      </main>
    </div>
  );
};

export default MyLikes;
