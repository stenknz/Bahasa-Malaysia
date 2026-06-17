import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { synthesizeSpeech } from "@malay/audio";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, voice, speed } = await req.json();
  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

  try {
    const audioBuffer = await synthesizeSpeech(text, voice, speed);
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS failed:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
