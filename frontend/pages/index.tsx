import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { signInWithGoogle, signOut } from "../lib/auth";
import AuthModal from "@/components/organisms/AuthModal";
import Test from "@/components/Test";
import Link from "next/link";
import HeroSection from "../components/organisms/HeroSection";
import PageTab from "../components/organisms/PageTab";
import { usePhotoContext } from "../contexts/PhotoContext";
import { getPhotos } from "../utils/api";
import { PhotoProvider } from "../contexts/PhotoContext";
import { NextSeo } from "next-seo";

const IndexPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const { setAllPhotos } = usePhotoContext();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
    // API から写真を取得して、PhotoContext のステートを更新する
    const fetchPhotos = async () => {
      const fetchedPhotos = await getPhotos({ all_users: true });
      setAllPhotos(fetchedPhotos);
    };

    if (user) {
      // ここでuserがnullでないことを確認
      fetchPhotos();
    }
  }, [user]); // 依存配列から setAllPhotos を削除

  return (
    <div className="flex flex-col min-h-screen">
      <NextSeo
        title="ShotSharing-カメラ初心者のための画像投稿サービス"
        description="This is the home page of our website."
        openGraph={{
          url: "https://shotsharing.vercel.app/",
          title: "ShotSharing-カメラ初心者のための画像共有サービス",
          description:
            "ShotSharingはカメラ初心者向けの画像共有サービスです。撮影時のカメラの設定値も一緒にシェアできるため、写真撮影のスキルを向上させるのに最適なプラットフォームです。",
          images: [
            {
              url: "https://shotsharing.vercel.app/og-image.jpg",
              width: 800,
              height: 600,
              alt: "ShotSharing-カメラ初心者のための画像共有サービス",
            },
          ],
        }}
      />
      <main
        className="flex-grow"
        style={{ minHeight: "150vh", backgroundColor: "white" }}
      >
        <HeroSection />
        <PageTab />
      </main>
    </div>
  );
};

export default IndexPage;
