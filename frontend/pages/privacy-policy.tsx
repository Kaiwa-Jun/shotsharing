import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここはプライバシーポリシーページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
