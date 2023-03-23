import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここはサービス説明です。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
      <Footer />
    </div>
  );
};

export default About;
