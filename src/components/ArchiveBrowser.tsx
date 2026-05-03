"use client";

import { useMemo, useState } from "react";
import type { Idea } from "@/lib/types";
import { IdeaCard } from "./IdeaCard";

export function ArchiveBrowser({ ideas }: { ideas: Idea[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of ideas) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [ideas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ideas.filter((i) => {
      if (activeCategory && i.category !== activeCategory) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.hook} ${i.problem} ${i.region_focus.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [ideas, query, activeCategory]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-3xl font-bold">أرشيف الأفكار</h1>
        <span className="text-sm text-black/50">{filtered.length} من {ideas.length}</span>
      </div>

      <div className="space-y-4 mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في الأفكار..."
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-accent"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              activeCategory === null
                ? "bg-accent text-white border-accent"
                : "bg-white border-black/10 text-black/70 hover:border-accent/50"
            }`}
          >
            الكل
          </button>
          {categories.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                activeCategory === cat
                  ? "bg-accent text-white border-accent"
                  : "bg-white border-black/10 text-black/70 hover:border-accent/50"
              }`}
            >
              {cat} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-black/50">
          لا توجد أفكار مطابقة. جرّب كلمة بحث أخرى.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((i) => <IdeaCard key={i.id} idea={i} />)}
        </div>
      )}
    </div>
  );
}
