import { useEffect, useState } from "react";
import HeroSection from "@/components/organisms/HeroSection";

import AboutArea from "../components/organisms/AboutArea";
import PageButton from "../components/organisms/PageButton";

const About: React.FC = () => {
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
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <HeroSection />
        <PageButton />
        <AboutArea />
      </main>
    </div>
  );
};

export default About;
