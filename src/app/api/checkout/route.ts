import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase-server";
import { PRODUCTS } from "@/lib/polar";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/pricing", req.url), 303);
  }

  const form = await req.formData();
  const plan = form.get("plan") === "yearly" ? "yearly" : "monthly";
  const productId = PRODUCTS[plan];

  const origin = new URL(req.url).origin;
  const apiBase =
    (process.env.POLAR_SERVER ?? "sandbox") === "production"
      ? "https://api.polar.sh"
      : "https://sandbox-api.polar.sh";

  const res = await fetch(`${apiBase}/v1/checkouts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      products: [productId],
      customer_email: user.email,
      success_url: `${origin}/account?checkout=success`,
      metadata: { user_id: user.id },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Polar checkout failed:", res.status, errorText);
    return NextResponse.json({ error: "checkout_failed", detail: errorText }, { status: 500 });
  }

  const checkout = await res.json();
  return NextResponse.redirect(checkout.url, 303);
}
