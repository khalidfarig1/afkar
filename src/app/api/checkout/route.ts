import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase-server";
import { polar, PRODUCTS } from "@/lib/polar";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/pricing", req.url), 303);
  }

  const form = await req.formData();
  const plan = form.get("plan") === "yearly" ? "yearly" : "monthly";
  const productId = PRODUCTS[plan];

  const origin = new URL(req.url).origin;
  const checkout = await polar().checkouts.create({
    products: [productId],
    customerEmail: user.email,
    successUrl: `${origin}/account?checkout=success`,
    metadata: { user_id: user.id },
  });

  return NextResponse.redirect(checkout.url, 303);
}
