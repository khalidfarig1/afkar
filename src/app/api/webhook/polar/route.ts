import { NextRequest, NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const sb = admin();
  const { data } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  return data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k] = v; });

  let event;
  try {
    event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET!);
  } catch (e) {
    if (e instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
    throw e;
  }

  const sub = (event as { data?: Record<string, unknown> }).data;
  if (!sub || !event.type.startsWith("subscription.")) {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const email = (sub.customer as { email?: string } | undefined)?.email
    ?? (sub as { customer_email?: string }).customer_email;
  if (!email) return NextResponse.json({ error: "no email" }, { status: 400 });

  const metadataUserId = (sub.metadata as { user_id?: string } | undefined)?.user_id;
  const userId = metadataUserId ?? (await findUserIdByEmail(email));
  if (!userId) return NextResponse.json({ error: "user not found", email }, { status: 404 });

  const sb = admin();
  await sb.from("subscriptions").upsert(
    {
      user_id: userId,
      email,
      polar_customer_id: (sub.customer as { id?: string } | undefined)?.id ?? null,
      polar_subscription_id: sub.id as string,
      product_id: sub.product_id as string,
      status: sub.status as string,
      current_period_end: (sub.current_period_end as string) ?? null,
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  return NextResponse.json({ ok: true, type: event.type });
}
