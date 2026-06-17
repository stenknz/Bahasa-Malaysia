import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const expected = formData.get("expected") as string;

  // Placeholder: returns random score 70-100%
  // Full Google Cloud STT integration will go here
  const accuracy = Math.floor(Math.random() * 30) + 70;

  return NextResponse.json({ accuracy, expected });
}
