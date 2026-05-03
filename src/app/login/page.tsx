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
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
