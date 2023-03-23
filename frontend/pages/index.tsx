import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { signInWithGoogle, signOut } from "../lib/auth";
import AuthModal from "@/components/atoms/AuthModal";
import Test from "@/components/Test";
import Header from "@/components/Header";
import Link from "next/link";

const IndexPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

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
    </div>
  );
};

export default IndexPage;
