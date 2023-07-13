import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/animations.css";
import "flowbite/dist/flowbite.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PhotoProvider } from "../contexts/PhotoContext";
import { UserProvider } from "../contexts/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0); // New state for likes count

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWs(new WebSocket("ws://localhost:3000/cable"));
    }
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("connected to websocket");
        ws.send(
          JSON.stringify({
            command: "subscribe",
            identifier: JSON.stringify({
              channel: "LikesChannel",
            }),
          })
        );
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const message = response.message;
        if (message && message.likes_count) {
          setLikesCount(message.likes_count); // Update likes count when receiving a message
        }
      };

      ws.onclose = () => {
        console.log("disconnected from websocket");
      };
    }

    return () => {
      if (ws) ws.close();
    };
  }, [ws]);

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
