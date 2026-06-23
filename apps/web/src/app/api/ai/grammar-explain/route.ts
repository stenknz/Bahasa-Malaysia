import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { explainGrammar } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, level } = await req.json();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const result = await explainGrammar(question, level ?? "beginner");
  if (!result.success) {
    return NextResponse.json({ answer: "Sorry, I'm having trouble thinking. Please try again." });
  }

  return NextResponse.json({ answer: result.data });
}
