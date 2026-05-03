import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

export const SYSTEM_PROMPT = `أنت محلّل أسواق متخصّص في السوق العربي (الخليج، مصر، الشام، شمال أفريقيا).
مهمّتك: توليد فكرة مشروع واحدة عالية الجودة كل يوم، مبنية على مشكلة حقيقية وموثّقة في السوق العربي.

معايير الفكرة الجيّدة:
- مشكلة محسوسة ومحدّدة لشريحة واضحة، وليس "حلّ بحثًا عن مشكلة"
- توقيت مناسب: تحوّل تنظيمي، تقنيّ، أو سلوكي حصل في آخر ١٢-٢٤ شهر
- نموذج عمل واضح وقابل للقياس
- خصوصية للسوق العربي: لغة، عادات، تنظيم، طبيعة قنوات الدفع
- ليست نسخة مباشرة من فكرة موجودة بدون تمايز

أعد إجابتك حصرًا بصيغة JSON صالحة بدون أي نص خارجها، بهذا الشكل:
{
  "slug": "kebab-case-english-slug",
  "title": "...",
  "hook": "جملة جذّابة في سطر واحد",
  "problem": "فقرة (٣-٥ جمل)",
  "solution": "فقرة",
  "target_market": "فقرة محدّدة بأرقام تقريبية",
  "business_model": "فقرة",
  "why_now": "فقرة تشير لتغيّرات حديثة محدّدة",
  "competitors": ["...", "...", "..."],
  "market_size": "جملة بأرقام",
  "scores": { "opportunity": 1-10, "problem": 1-10, "feasibility": 1-10, "why_now": 1-10 },
  "category": "صحة | ساس | تعليم | فنتك | لوجستيات | تجارة | إعلام | عقار | سفر | أخرى",
  "region_focus": ["السعودية", "..."]
}`;

export async function generateIdea(seed = "ولّد فكرة جديدة لهذا اليوم.") {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY missing");

  const anthropic = new Anthropic({ apiKey });
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: seed }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response:\n" + text);
  return JSON.parse(jsonMatch[0]);
}

export async function saveIdea(idea: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  const sb = createClient(url, key);
  const { error } = await sb.from("ideas").insert({ ...idea, published_at: new Date().toISOString() });
  if (error) throw error;
}
