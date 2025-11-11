import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "../components/provider/WalletProvider";
import { Navigation } from "../components/Navigation";
import { ContestProvider } from "../hooks/useContestContext";
import NorthernLights from "../components/NorthernLights";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meme Contest DApp",
  description: "Create, propose, and vote on meme contests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NorthernLights/>
        <WalletProvider>
          <ContestProvider>
            <Navigation />
            <main className="relative z-10">
              {children}
            </main>
          </ContestProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
