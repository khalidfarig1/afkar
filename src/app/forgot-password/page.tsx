"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const sb = supabaseBrowser();
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-2">إعادة تعيين كلمة المرور</h1>
      <p className="text-black/60 mb-6 text-sm">
        أدخل بريدك وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
      </p>

      {status === "sent" ? (
        <div className="p-5 rounded-xl bg-accent/10 border border-accent/30 text-center">
          <p className="font-semibold mb-1">تحقّق من بريدك ✉️</p>
          <p className="text-sm text-black/60">
            أرسلنا رابطًا إلى <span className="font-mono">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-accent"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50"
          >
            {status === "loading" ? "جاري الإرسال..." : "أرسل رابط إعادة التعيين"}
          </button>
          {status === "error" && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}

      <p className="text-sm text-center mt-6 text-black/60">
        <Link href="/login" className="hover:underline">→ العودة لتسجيل الدخول</Link>
      </p>
    </div>
  );
}
