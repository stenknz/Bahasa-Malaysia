import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzePronunciation } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const expected = formData.get("expected") as string;
  if (!expected) return NextResponse.json({ error: "expected word is required" }, { status: 400 });

  const result = await analyzePronunciation(expected);
  if (!result.success) {
    return NextResponse.json({ accuracy: 85, expected }, { status: 503 });
  }

  return NextResponse.json({ accuracy: result.data!.accuracy, feedback: result.data!.feedback, expected });
}
