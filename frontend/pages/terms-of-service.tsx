import Link from "next/link";
import Header from "@/components/Header";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここは利用規約ページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
    </div>
  );
};

export default TermsOfService;
