import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ImageDetail: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここは画像詳細ページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
      <Footer />
    </div>
  );
};

export default ImageDetail;
