import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/10 mt-20">
      <div className="max-w-5xl mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <Section title="المنتج">
          <FooterLink href="/">فكرة اليوم</FooterLink>
          <FooterLink href="/archive">الأرشيف</FooterLink>
          <FooterLink href="/pricing">الأسعار</FooterLink>
        </Section>

        <Section title="الحساب">
          <FooterLink href="/login">تسجيل الدخول</FooterLink>
          <FooterLink href="/account">حسابي</FooterLink>
          <FooterLink href="/forgot-password">نسيت كلمة المرور؟</FooterLink>
        </Section>

        <Section title="الشركة">
          <FooterLink href="/about">عن الموقع</FooterLink>
          <FooterLink href="mailto:kfarig@yahoo.com">تواصل معنا</FooterLink>
        </Section>

        <Section title="قانوني">
          <FooterLink href="/terms">الشروط والأحكام</FooterLink>
          <FooterLink href="/privacy">سياسة الخصوصية</FooterLink>
        </Section>
      </div>

      <div className="border-t border-black/5">
        <div className="max-w-5xl mx-auto px-5 py-5 flex justify-between text-xs text-black/50">
          <span>أفكار · صُنع بحبّ للسوق العربي</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-black/80 mb-3">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-black/60 hover:text-accent transition">
        {children}
      </Link>
    </li>
  );
}
