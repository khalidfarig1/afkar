export type Idea = {
  id: string;
  slug: string;
  title: string;
  hook: string;
  problem: string;
  solution: string;
  target_market: string;
  business_model: string;
  why_now: string;
  competitors: string[];
  market_size: string;
  scores: { opportunity: number; problem: number; feasibility: number; why_now: number };
  category: string;
  region_focus: string[];
  published_at: string;
};
