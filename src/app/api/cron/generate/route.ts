import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateIdea, saveIdea } from "@/lib/generate";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const idea = await generateIdea();
  await saveIdea(idea);
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath(`/idea/${idea.slug}`);

  return NextResponse.json({ ok: true, title: idea.title, slug: idea.slug });
}
