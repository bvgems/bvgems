"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { InitGemstones } from "@/components/CommonComponents/InitGemstones";
import { Footer } from "@/components/CommonComponents/Footer";
import { WhatsAppButton } from "@/components/CommonComponents/WhatsAppButton";
import { Divider } from "@mantine/core";
import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);

export function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center">
        <div className="w-48 h-48">
          <Player
            autoplay
            loop
            src="/assets/loading-animation.json"
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <p className="mt-4 text-lg font-medium font-serif animate-pulse opacity-80">
          Polishing your experience...
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <InitGemstones />
      {children}
      <WhatsAppButton />
      <Divider />
      <Footer />
    </>
  );
}
