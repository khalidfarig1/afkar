import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase-server";

export async function HeaderNav() {
  const user = await getCurrentUser();
  return (
    <nav className="flex gap-5 text-sm text-black/70 items-center">
      <Link href="/" className="hover:text-ink">فكرة اليوم</Link>
      <Link href="/archive" className="hover:text-ink">الأرشيف</Link>
      <Link href="/pricing" className="hover:text-ink">الأسعار</Link>
      {user ? (
        <Link href="/account" className="px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold">
          حسابي
        </Link>
      ) : (
        <Link href="/login" className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold">
          دخول
        </Link>
      )}
    </nav>
  );
}
