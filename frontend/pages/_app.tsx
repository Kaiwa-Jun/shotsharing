import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/animations.css";
import "flowbite/dist/flowbite.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PhotoProvider } from "../contexts/PhotoContext";
import { UserProvider } from "../contexts/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProvider>
        <PhotoProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </PhotoProvider>
      </UserProvider>
    </div>
  );
}

export default MyApp;
