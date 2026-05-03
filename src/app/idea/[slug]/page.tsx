import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllIdeas, getIdeaBySlug } from "@/lib/ideas";
import { ScoreBar } from "@/components/ScoreBar";

export const revalidate = 3600;

export async function generateStaticParams() {
  const ideas = await getAllIdeas();
  return ideas.map((i) => ({ slug: i.slug }));
}

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);
  if (!idea) notFound();

  return (
    <article className="max-w-3xl">
      <Link href="/archive" className="text-sm text-accent hover:underline">→ كل الأفكار</Link>
      <div className="text-xs text-black/50 mt-6 mb-2 flex gap-2 items-center">
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent">{idea.category}</span>
        <span>{new Date(idea.published_at).toLocaleDateString("ar-SA")}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{idea.title}</h1>
      <p className="text-xl text-black/70 leading-relaxed mb-10">{idea.hook}</p>

      <div className="grid md:grid-cols-2 gap-3 p-5 rounded-xl bg-white border border-black/10 mb-10">
        <ScoreBar label="الفرصة" value={idea.scores.opportunity} />
        <ScoreBar label="حدّة المشكلة" value={idea.scores.problem} />
        <ScoreBar label="قابلية التنفيذ" value={idea.scores.feasibility} />
        <ScoreBar label="التوقيت" value={idea.scores.why_now} />
      </div>

      <div className="prose-ar space-y-6">
        <Block title="المشكلة" body={idea.problem} />
        <Block title="الحل المقترح" body={idea.solution} />
        <Block title="السوق المستهدف" body={idea.target_market} />
        <Block title="نموذج العمل" body={idea.business_model} />
        <Block title="لماذا الآن؟" body={idea.why_now} />
        <Block title="حجم السوق" body={idea.market_size} />
        <div>
          <h2>المنافسون</h2>
          <ul>
            {idea.competitors.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <h2>التركيز الجغرافي</h2>
          <p>{idea.region_focus.join("، ")}</p>
        </div>
      </div>
    </article>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (<div><h2>{title}</h2><p>{body}</p></div>);
}
