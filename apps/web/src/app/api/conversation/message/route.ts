import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId, content } = await req.json();

  const conversation = await db.query.conversationSessions.findFirst({
    where: (c, { eq }) => eq(c.id, conversationId),
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = [...(conversation.messages as any[]), { role: "user", content, timestamp: new Date().toISOString() }];

  const aiResponse = "Baik. Saya faham. Mari kita teruskan.";

  const updatedMessages = [...messages, { role: "ai", content: aiResponse, timestamp: new Date().toISOString() }];

  await db.update(schema.conversationSessions)
    .set({ messages: updatedMessages as any })
    .where(eq(schema.conversationSessions.id, conversationId));

  return NextResponse.json({ reply: aiResponse, messages: updatedMessages });
}
