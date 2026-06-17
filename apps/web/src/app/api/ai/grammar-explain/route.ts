import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question } = await req.json();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const responses: Record<string, string> = {
    "tidak": "In Malay, 'tidak' (or its colloquial form 'tak') is used to negate verbs and adjectives. Place it before the verb or adjective. Example: 'Saya tidak mahu' (I don't want). For nouns, use 'bukan' instead. Example: 'Ini bukan buku' (This is not a book).",
    "kah": "Adding '-kah' to the end of a sentence turns it into a yes/no question. Example: 'Awak suka?' (You like?) vs 'Awak suka kah?' (Do you like?). It's optional in casual speech but polite in formal contexts.",
  };

  const answer = Object.entries(responses).find(([key]) =>
    question.toLowerCase().includes(key)
  )?.[1] ?? "That's a great question! In Malay, word order is generally Subject-Verb-Object, similar to English. Adjectives follow nouns (e.g., 'buku merah' = 'book red' = 'red book'). Feel free to ask more specific questions!";

  return NextResponse.json({ answer });
}
