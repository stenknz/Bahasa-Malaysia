import { createAgentClient, getModel, SYSTEM_PROMPTS, type AgentResponse } from "@malay/shared";

export async function explainGrammar(question: string, level: string): Promise<AgentResponse<string>> {
  try {
    const client = createAgentClient("grammar_tutor");
    const completion = await client.chat.completions.create({
      model: getModel("grammar_tutor"),
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.grammar_tutor },
        { role: "user", content: `Student level: ${level}\n\nQuestion: ${question}` },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    return { success: true, data: completion.choices[0]?.message?.content ?? "I'm not sure about that one." };
  } catch (err) {
    console.error({ agent: "grammar_tutor", error: err instanceof Error ? err.message : err, question });
    return { success: false, error: "Failed to get grammar explanation" };
  }
}
