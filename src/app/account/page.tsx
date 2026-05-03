import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getActiveSubscription } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const sub = await getActiveSubscription(user.id);
  const isSubscribed = sub?.status === "active" || sub?.status === "trialing";

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">حسابي</h1>

      <div className="space-y-6">
        <Section title="البريد الإلكتروني">
          <p className="font-mono text-sm" dir="ltr">{user.email}</p>
        </Section>

        <Section title="الاشتراك">
          {isSubscribed ? (
            <div className="space-y-2">
              <p className="font-semibold text-accent">نشط</p>
              <p className="text-sm text-black/60">
                {sub?.cancel_at_period_end
                  ? `ينتهي في ${sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("ar-SA") : "—"}`
                  : `يتجدّد في ${sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("ar-SA") : "—"}`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-black/60">لا يوجد اشتراك نشط.</p>
              <Link
                href="/pricing"
                className="inline-block px-5 py-2.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90"
              >
                اشترك الآن
              </Link>
            </div>
          )}
        </Section>

        <form action="/auth/signout" method="POST">
          <button className="text-sm text-black/50 hover:text-red-600 underline">
            تسجيل الخروج
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl bg-white border border-black/10">
      <h2 className="text-sm font-semibold text-black/60 mb-3">{title}</h2>
      {children}
    </div>
  );
}
