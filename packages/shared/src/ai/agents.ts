import type { AIAgentName, LLMProvider } from "./types";

interface AgentConfig {
  model: string;
  providerPriority: LLMProvider[];
}

export const agentConfigs: Record<AIAgentName, AgentConfig> = {
  grammar_tutor: {
    model: "deepseek-v4-pro",
    providerPriority: ["opencode-go", "ollama"],
  },
  cultural_guide: {
    model: "deepseek-v4-pro",
    providerPriority: ["opencode-go", "ollama"],
  },
  conversation_partner: {
    model: "deepseek-v4-pro",
    providerPriority: ["opencode-go", "ollama"],
  },
  pronunciation_coach: {
    model: "deepseek-v4-flash",
    providerPriority: ["opencode-go", "ollama"],
  },
};
