import Link from "next/link";
import Header from "@/components/Header";

const ImageDetail: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここは画像詳細ページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
    </div>
  );
};

export default ImageDetail;
