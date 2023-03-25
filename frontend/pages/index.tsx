import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { signInWithGoogle, signOut } from "../lib/auth";
import AuthModal from "@/components/organisms/AuthModal";
import Test from "@/components/Test";
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";

const IndexPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow" style={{ minHeight: "150vh" }}>
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
      <Footer
        className={`${
          showFooter
            ? "bg-white dark:bg-gray-900 fixed bottom-0 inset-x-0 z-50"
            : "hidden"
        }`}
      ></Footer>
    </div>
  );
};

export default IndexPage;
