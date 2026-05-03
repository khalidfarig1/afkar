import { config } from "dotenv";
import path from "node:path";
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

import { generateIdea, saveIdea } from "../src/lib/generate";

const SEEDS = [
  "ولّد فكرة في قطاع الفنتك للسوق المصري، مع تركيز على التحويلات والمدفوعات الصغيرة.",
  "ولّد فكرة في قطاع التعليم الإلكتروني للأطفال في الخليج، تستفيد من الذكاء الاصطناعي.",
  "ولّد فكرة لوجستيات أو توصيل ميل-أخير في الرياض أو دبي.",
  "ولّد فكرة ساس B2B لقطاع المطاعم والمقاهي في السعودية.",
  "ولّد فكرة في قطاع العقار أو الإيجار قصير الأمد للسوق العربي.",
  "ولّد فكرة في قطاع الصحة النفسية للشباب العرب، بنموذج رقمي.",
  "ولّد فكرة في قطاع السياحة الدينية أو الحج والعمرة.",
  "ولّد فكرة في قطاع الإعلام أو المحتوى الصوتي العربي (بودكاست/أوديو).",
  "ولّد فكرة في قطاع الزراعة أو الأمن الغذائي في الخليج أو شمال أفريقيا.",
];

async function main() {
  const limit = Number(process.argv[2]) || SEEDS.length;
  const seeds = SEEDS.slice(0, limit);
  console.log(`🌱 توليد ${seeds.length} أفكار...\n`);

  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    try {
      console.log(`[${i + 1}/${seeds.length}] ${seed.slice(0, 60)}...`);
      const idea = await generateIdea(seed);
      await saveIdea(idea);
      console.log(`   ✓ ${idea.title}\n`);
    } catch (e) {
      console.error(`   ✗ ${(e as Error).message}\n`);
    }
  }
  console.log("✓ تم");
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
