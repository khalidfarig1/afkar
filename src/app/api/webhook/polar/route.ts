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
  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw new Error(`listUsers failed: ${error.message}`);
  return data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k] = v; });

  // 1. Verify signature — bad signature is a permanent error, no retry.
  let event;
  try {
    event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET!);
  } catch (e) {
    if (e instanceof WebhookVerificationError) {
      console.error("[polar webhook] invalid signature", e.message);
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }
    console.error("[polar webhook] validation threw", e);
    return NextResponse.json({ error: "validation_error" }, { status: 500 });
  }

  // 2. Process — any unexpected failure returns 5xx so Polar retries.
  try {
    const sub = (event as { data?: Record<string, unknown> }).data;
    if (!sub || !event.type.startsWith("subscription.")) {
      return NextResponse.json({ ok: true, ignored: event.type });
    }

    const email = (sub.customer as { email?: string } | undefined)?.email
      ?? (sub as { customer_email?: string }).customer_email;
    if (!email) {
      console.error("[polar webhook] missing email", { type: event.type, sub_id: sub.id });
      return NextResponse.json({ error: "missing_email" }, { status: 500 });
    }

    const metadataUserId = (sub.metadata as { user_id?: string } | undefined)?.user_id;
    const userId = metadataUserId ?? (await findUserIdByEmail(email));
    if (!userId) {
      // Likely a race: webhook arrived before user record finished writing. Polar will retry.
      console.warn("[polar webhook] user not found, will retry", { email, sub_id: sub.id });
      return NextResponse.json({ error: "user_not_found", email }, { status: 503 });
    }

    const sb = admin();
    const { error: upsertError } = await sb.from("subscriptions").upsert(
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

    if (upsertError) {
      console.error("[polar webhook] upsert failed", { email, sub_id: sub.id, error: upsertError });
      return NextResponse.json({ error: "db_upsert_failed", detail: upsertError.message }, { status: 500 });
    }

    console.log("[polar webhook] processed", { type: event.type, email, status: sub.status });
    return NextResponse.json({ ok: true, type: event.type });
  } catch (e) {
    console.error("[polar webhook] unhandled error", e);
    return NextResponse.json({ error: "unhandled", detail: String(e) }, { status: 500 });
  }
}
