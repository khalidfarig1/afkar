import Link from "next/link";
import { getCurrentUser, getActiveSubscription } from "@/lib/supabase-server";

export default async function PricingPage() {
  const user = await getCurrentUser();
  const sub = user ? await getActiveSubscription(user.id) : null;
  const isSubscribed = sub?.status === "active" || sub?.status === "trialing";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-3">اشترك في أفكار Pro</h1>
        <p className="text-lg text-black/60">
          وصول كامل لأرشيف أفكار المشاريع مع تحديث يومي
        </p>
      </div>

      {isSubscribed && (
        <div className="mb-8 p-4 rounded-xl bg-accent/10 border border-accent/30 text-center">
          أنت مشترك حاليًا — <Link href="/account" className="font-semibold underline">إدارة الاشتراك</Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Plan
          name="شهري"
          price="$9"
          period="/ شهر"
          plan="monthly"
          features={[
            "وصول كامل للأرشيف",
            "بحث وتصنيف",
            "فكرة جديدة كل يوم",
            "إلغاء في أي وقت",
          ]}
          disabled={isSubscribed}
        />
        <Plan
          name="سنوي"
          price="$79"
          period="/ سنة"
          plan="yearly"
          highlight="وفّر 27%"
          features={[
            "كل مزايا الخطة الشهرية",
            "شهران مجاناً مقارنة بالشهري",
            "أولوية الدعم",
            "إلغاء في أي وقت",
          ]}
          disabled={isSubscribed}
        />
      </div>

      <p className="text-center text-sm text-black/50 mt-8">
        الدفع آمن عبر Polar. الأسعار شاملة الضريبة.
      </p>
    </div>
  );
}

function Plan({
  name, price, period, plan, features, highlight, disabled,
}: {
  name: string; price: string; period: string; plan: "monthly" | "yearly";
  features: string[]; highlight?: string; disabled?: boolean;
}) {
  return (
    <div className={`p-7 rounded-2xl border bg-white ${highlight ? "border-accent" : "border-black/10"} relative`}>
      {highlight && (
        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
          {highlight}
        </div>
      )}
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <div className="mb-5">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-black/50 ms-1">{period}</span>
      </div>
      <ul className="space-y-2 mb-6 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-accent mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <form action="/api/checkout" method="POST">
        <input type="hidden" name="plan" value={plan} />
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? "أنت مشترك" : "اشترك الآن"}
        </button>
      </form>
    </div>
  );
}
