import Link from "next/link";
import Header from "@/components/Header";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここはプライバシーポリシーページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
    </div>
  );
};

export default PrivacyPolicy;
