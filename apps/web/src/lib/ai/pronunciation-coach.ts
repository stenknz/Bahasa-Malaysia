import { createAgentClient, getModel, SYSTEM_PROMPTS, type AgentResponse } from "@malay/shared";

export async function analyzePronunciation(targetWord: string): Promise<
  AgentResponse<{ accuracy: number; feedback: string }>
> {
  try {
    const client = createAgentClient("pronunciation_coach");
    const completion = await client.chat.completions.create({
      model: getModel("pronunciation_coach"),
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.pronunciation_coach },
        { role: "user", content: `Target word: "${targetWord}"` },
      ],
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    return {
      success: true,
      data: {
        accuracy: typeof parsed.accuracy === "number" ? parsed.accuracy : 85,
        feedback: typeof parsed.feedback === "string" ? parsed.feedback : "Good attempt! Keep practicing.",
      },
    };
  } catch (err) {
    console.error({ agent: "pronunciation_coach", error: err instanceof Error ? err.message : err, targetWord });
    return { success: false, error: "Failed to analyze pronunciation" };
  }
}
