import { useEffect, useState } from "react";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "@/components/organisms/UserInfo";
import { Router } from "next/router";
import { firebaseAuth } from "../lib/auth";

const MyPage: React.FC = () => {
  const [showFooter, setShowFooter] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);

  const userId = firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null;

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight / 2;
      if (window.scrollY > scrollThreshold) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchUserPhotos = async () => {
      const response = await fetch(`/api/v1/user_photos/${userId}`);
      const data = await response.json();
      setUserPhotos(data);
    };

    fetchUserPhotos();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <MypageTab />
        <div className="grid grid-cols-3 gap-4">
          {userPhotos.map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              alt="User uploaded"
              className="w-full h-auto"
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyPage;
