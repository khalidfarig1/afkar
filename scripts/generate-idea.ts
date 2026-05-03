import { config } from "dotenv";
import path from "node:path";
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

import { generateIdea, saveIdea } from "../src/lib/generate";

async function main() {
  const seed = process.argv.slice(2).join(" ") || undefined;
  console.log("🤖 توليد الفكرة...");
  const idea = await generateIdea(seed);
  console.log("✓ تم توليد الفكرة:", idea.title);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("\nSupabase env vars missing — printing JSON only:\n");
    console.log(JSON.stringify(idea, null, 2));
    return;
  }

  await saveIdea(idea);
  console.log("✓ حُفظت في Supabase");
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
