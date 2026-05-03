import { getAllIdeas } from "@/lib/ideas";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";

export const revalidate = 3600;

export default async function Archive() {
  const ideas = await getAllIdeas();
  return <ArchiveBrowser ideas={ideas} />;
}
