import Link from "next/link";
import { getAllIdeas, getLatestIdea } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
import { ScoreBar } from "@/components/ScoreBar";

export const revalidate = 3600;

export default async function Home() {
  const [latest, all] = await Promise.all([getLatestIdea(), getAllIdeas()]);
  const rest = all.filter((i) => i.id !== latest.id).slice(0, 6);

  return (
    <div className="space-y-16">
      <section>
        <div className="text-xs text-accent font-semibold mb-3 tracking-wider">
          فكرة اليوم · {new Date(latest.published_at).toLocaleDateString("ar-SA")}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{latest.title}</h1>
        <p className="text-lg text-black/70 leading-relaxed mb-8 max-w-3xl">{latest.hook}</p>

        <div className="grid md:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-6 prose-ar">
            <Section title="المشكلة" body={latest.problem} />
            <Section title="الحل" body={latest.solution} />
            <Section title="لماذا الآن؟" body={latest.why_now} />
          </div>
          <aside className="space-y-5 p-5 rounded-xl bg-white border border-black/10 h-fit">
            <h3 className="font-bold text-sm">التقييم</h3>
            <div className="space-y-3">
              <ScoreBar label="الفرصة" value={latest.scores.opportunity} />
              <ScoreBar label="حدّة المشكلة" value={latest.scores.problem} />
              <ScoreBar label="قابلية التنفيذ" value={latest.scores.feasibility} />
              <ScoreBar label="التوقيت" value={latest.scores.why_now} />
            </div>
            <div className="pt-3 border-t border-black/10 text-sm space-y-2">
              <div><span className="text-black/50">الفئة:</span> {latest.category}</div>
              <div><span className="text-black/50">السوق:</span> {latest.region_focus.join("، ")}</div>
            </div>
            <Link
              href={`/idea/${latest.slug}`}
              className="block text-center w-full py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90"
            >
              التفاصيل الكاملة
            </Link>
          </aside>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold">أحدث الأفكار</h2>
          <Link href="/archive" className="text-sm text-accent hover:underline">عرض الكل ←</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {rest.map((i) => <IdeaCard key={i.id} idea={i} />)}
        </div>
      </section>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
