import { useEffect, useState } from "react";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "../components/organisms/UserInfo
import { Router } from "next/router";

const MyPage: React.FC = () => {
  const [showFooter, setShowFooter] = useState(false);

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
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <MypageTab />
        マイページ
      </main>
    </div>
  );
};

export default MyPage;
