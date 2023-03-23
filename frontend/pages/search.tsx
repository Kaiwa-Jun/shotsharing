import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Search: React.FC = () => {
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
      <Header />

      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        検索ページ
      </main>
      <Footer
        className={`${
          showFooter
            ? "bg-white dark:bg-gray-900 fixed bottom-0 inset-x-0 z-50"
            : "hidden"
        }`}
      ></Footer>
    </div>
  );
};

export default Search;
