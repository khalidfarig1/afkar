import Link from "next/link";
import type { Idea } from "@/lib/types";

export function IdeaCard({ idea }: { idea: Idea }) {
  const total = Object.values(idea.scores).reduce((a, b) => a + b, 0);
  return (
    <Link
      href={`/idea/${idea.slug}`}
      className="block p-5 rounded-xl border border-black/10 bg-white hover:border-accent/60 hover:shadow-sm transition"
    >
      <div className="flex items-center gap-2 text-xs text-black/50 mb-3">
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent">{idea.category}</span>
        {idea.region_focus.slice(0, 2).map((r) => (
          <span key={r}>· {r}</span>
        ))}
        <span className="ms-auto tabular-nums">{total}/40</span>
      </div>
      <h3 className="font-bold text-lg mb-2 leading-snug">{idea.title}</h3>
      <p className="text-sm text-black/70 leading-relaxed line-clamp-2">{idea.hook}</p>
    </Link>
  );
}
