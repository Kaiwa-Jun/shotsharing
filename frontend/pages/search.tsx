import { useEffect, useState } from "react";
import HeroSection from "@/components/organisms/HeroSection";
import SearchBar from "@/components/organisms/SearchBar";
import SearchResultList from "@/components/organisms/SearchResultList";
import { fetchSearchResults } from "../utils/api";
import { SearchResult } from "../types/searchResult";

const Search: React.FC = () => {
  const [showFooter, setShowFooter] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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

  const handleSearch = async () => {
    const results = await fetchSearchResults(keyword);
    setSearchResults(results);
  };

  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword).then((results) => {
        const uniqueResults = Array.from(
          results
            .reduce((map, result) => map.set(result.id, result), new Map())
            .values()
        );
        setSearchResults(uniqueResults);
      });
    }
  }, [keyword]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <HeroSection />
        <SearchBar onSearch={setKeyword} onSubmit={handleSearch} />
        <SearchResultList searchResults={searchResults} />
      </main>
    </div>
  );
};

export default Search;
