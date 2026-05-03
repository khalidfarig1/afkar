import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Link from "next/link";
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
            <nav className="flex gap-5 text-sm text-black/70">
              <Link href="/" className="hover:text-ink">فكرة اليوم</Link>
              <Link href="/archive" className="hover:text-ink">الأرشيف</Link>
              <Link href="/about" className="hover:text-ink">عن الموقع</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-5 py-10">{children}</main>
        <footer className="max-w-5xl mx-auto px-5 py-10 text-sm text-black/50 border-t border-black/10 mt-20">
          صُنع بحبّ للسوق العربي · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
