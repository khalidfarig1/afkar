import { supabase } from "./supabase";
import { sampleIdeas } from "./sample-ideas";
import type { Idea } from "./types";

export async function getAllIdeas(): Promise<Idea[]> {
  if (!supabase) return sampleIdeas;
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("published_at", { ascending: false });
  if (error || !data || data.length === 0) return sampleIdeas;
  return data as Idea[];
}

export async function getLatestIdea(): Promise<Idea> {
  const ideas = await getAllIdeas();
  return ideas[0];
}

export async function getIdeaBySlug(slug: string): Promise<Idea | null> {
  const ideas = await getAllIdeas();
  return ideas.find((i) => i.slug === slug) ?? null;
}
