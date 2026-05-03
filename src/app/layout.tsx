import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Link from "next/link";
import { HeaderNav } from "@/components/HeaderNav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "أفكار — متصفّح أفكار المشاريع للسوق العربي",
  description: "فكرة مشروع جديدة كل يوم، مبنية على إشارات حقيقية من السوق العربي.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans min-h-screen">
        <header className="border-b border-black/10 bg-paper/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              أفكار<span className="text-accent">.</span>
            </Link>
            <HeaderNav />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-5 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
