import { createAgentClient, SYSTEM_PROMPTS, type AgentResponse } from "@malay/shared";

export async function askCulture(question: string): Promise<AgentResponse<string>> {
  try {
    const client = createAgentClient("cultural_guide");
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.cultural_guide },
        { role: "user", content: question },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    return { success: true, data: completion.choices[0]?.message?.content ?? "I'm not sure about that one." };
  } catch (err) {
    console.error("cultural_guide error:", err);
    return { success: false, error: "Failed to get cultural information" };
  }
}
