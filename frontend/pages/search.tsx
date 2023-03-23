import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Search: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      ここは検索ページです。
      <nav>
        <Link href="/">TOPページ</Link>
      </nav>
      <Footer />
    </div>
  );
};

export default Search;
