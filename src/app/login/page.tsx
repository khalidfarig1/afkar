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
