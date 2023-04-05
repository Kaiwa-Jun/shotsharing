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
      const fetchedPhotos = await getPhotos();
      setAllPhotos(fetchedPhotos);
    };

    fetchPhotos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main
        className="flex-grow"
        style={{ minHeight: "150vh", backgroundColor: "white" }}
      >
        <HeroSection />
        <PageTab />
        <Test />
        <nav>
          <Link href="/">TOPページ</Link>
          <Link href="/image-detail">画像の詳細ページ</Link>
          <Link href="/mypage">マイページ</Link>
          <Link href="/search">検索ページ</Link>
          <Link href="/about">サービス説明ページ</Link>
          <Link href="/privacy-policy">プライバシーポリシーページ</Link>
          <Link href="/terms-of-service">利用規約ページ</Link>
        </nav>
      </main>
    </div>
  );
};

export default IndexPage;
