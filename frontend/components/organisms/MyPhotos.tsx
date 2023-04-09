import React, { useEffect, useState } from "react";
import PhotoList from "../PhotoList";
import { getPhotos } from "../../utils/api";
import { useAuth } from "../../contexts/UserContext";
import { Photo } from "../../types/photo";

const MyPhotos: React.FC = () => {
  const [myPhotos, setMyPhotos] = useState<Photo[]>([]);
  const { user } = useAuth();
  console.log("User:", user);

  useEffect(() => {
    console.log("user:", user);
    if (user) {
      getPhotos({ firebase_uid: user.firebase_uid })
        .then((photos) => {
          console.log("Fetched photos:", photos);
          setMyPhotos(photos);
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
          <PhotoList photos={myPhotos} />
        ) : (
          <p>ログインしているユーザーの情報がありません。</p>
        )}
      </main>
    </div>
  );
};

export default MyPhotos;
