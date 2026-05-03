import { getAllIdeas } from "@/lib/ideas";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";
import { Paywall } from "@/components/Paywall";
import { getCurrentUser, getActiveSubscription } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function Archive() {
  const user = await getCurrentUser();
  const sub = user ? await getActiveSubscription(user.id) : null;
  const isSubscribed = sub?.status === "active" || sub?.status === "trialing";

  if (!isSubscribed) return <Paywall user={!!user} />;

  const ideas = await getAllIdeas();
  return <ArchiveBrowser ideas={ideas} />;
}
