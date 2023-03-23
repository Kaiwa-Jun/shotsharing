import Link from "next/link";
import Header from "@/components/Header";

const MyPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここはマイページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
    </div>
  );
};

export default MyPage;
