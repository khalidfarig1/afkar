import Link from "next/link";

export function Paywall({ user }: { user: boolean }) {
  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h1 className="text-3xl font-bold mb-3">محتوى للمشتركين فقط</h1>
      <p className="text-black/60 mb-8 leading-relaxed">
        أرشيف الأفكار الكامل متاح لمشتركي أفكار Pro. اشترك بـ ٩$ شهريًا للوصول لكل
        الأفكار، البحث، والتصنيف.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/pricing"
          className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90"
        >
          اشترك الآن
        </Link>
        {!user && (
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-white border border-black/10 font-semibold hover:border-accent/50"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
      <p className="text-sm text-black/50 mt-6">
        فكرة اليوم تبقى مجانية للجميع على <Link href="/" className="underline">الصفحة الرئيسية</Link>.
      </p>
    </div>
  );
}
