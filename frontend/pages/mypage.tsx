import { useEffect, useState } from "react";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "@/components/organisms/UserInfo";
import { Router } from "next/router";
import { firebaseAuth } from "../lib/auth";
import { Photo } from "@/types/photo";
import Image from "next/image";

const MyPage: React.FC = () => {
  const [showFooter, setShowFooter] = useState(false);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);

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
            <div key={photo.id} className="relative w-full h-auto">
              <Image
                src={photo.file_url}
                alt="User uploaded"
                layout="responsive"
                width={1}
                height={1}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyPage;
