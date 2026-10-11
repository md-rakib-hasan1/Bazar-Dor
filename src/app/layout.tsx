import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PriceMarquee from "@/components/PriceMarquee";
import Toaster from "@/components/Toaster";
import Footer from "@/components/Footer";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali","latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর | Bazar Dor",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর ও বাজারভিত্তিক দামের তুলনা এক নজরে দেখুন।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${notoSerifBengali.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <PriceMarquee />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
