import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getActiveSubscription } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?next=/account", req.url), 303);
  }

  const sub = await getActiveSubscription(user.id);
  if (!sub?.polar_customer_id) {
    return NextResponse.redirect(new URL("/pricing", req.url), 303);
  }

  const apiBase =
    (process.env.POLAR_SERVER ?? "production") === "production"
      ? "https://api.polar.sh"
      : "https://sandbox-api.polar.sh";

  const res = await fetch(`${apiBase}/v1/customer-sessions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ customer_id: sub.polar_customer_id }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Polar customer-session failed:", res.status, detail);
    return NextResponse.json({ error: "portal_failed", detail }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.redirect(data.customer_portal_url, 303);
}
