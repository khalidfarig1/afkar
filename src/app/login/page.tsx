"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Mode = "signin" | "signup";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setLoading(true);
    setError("");
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const sb = supabaseBrowser();
    const { error } =
      mode === "signin"
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="flex gap-1 mb-6 p-1 bg-black/5 rounded-xl">
        <button
          onClick={() => setMode("signin")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            mode === "signin" ? "bg-white shadow-sm" : "text-black/60"
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            mode === "signup" ? "bg-white shadow-sm" : "text-black/60"
          }`}
        >
          إنشاء حساب
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {mode === "signin" ? "أهلاً من جديد" : "ابدأ مع أفكار"}
      </h1>
      <p className="text-black/60 mb-6 text-sm">
        {mode === "signin"
          ? "أدخل بريدك وكلمة المرور للوصول لحسابك."
          : "أنشئ حسابك للاشتراك والوصول لأرشيف الأفكار."}
      </p>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-black/15 bg-white font-semibold hover:border-accent transition mb-4 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.4 4.5 9.8 8.6 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.4 16.2 43.5 24 43.5z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2c-.4.4 6.6-4.8 6.6-14.6 0-1.2-.1-2.4-.4-3.5z"/>
        </svg>
        المتابعة باستخدام Google
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-black/10" />
        <span className="text-xs text-black/40">أو</span>
        <div className="flex-1 h-px bg-black/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-accent"
          dir="ltr"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="كلمة المرور (٦ أحرف على الأقل)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-accent"
          dir="ltr"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50"
        >
          {loading
            ? "جاري..."
            : mode === "signin"
            ? "تسجيل الدخول"
            : "إنشاء حساب"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      {mode === "signin" && (
        <p className="text-sm text-center mt-4 text-black/60">
          <Link href="/forgot-password" className="hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </p>
      )}
    </div>
  );
}
