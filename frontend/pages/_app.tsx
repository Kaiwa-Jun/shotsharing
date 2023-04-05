import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "flowbite/dist/flowbite.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PhotoProvider } from "../contexts/PhotoContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <PhotoProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </PhotoProvider>
    </div>
  );
}

export default MyApp;
