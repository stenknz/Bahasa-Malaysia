import type { AIAgentName, LLMProvider } from "./types";

interface AgentConfig {
  models: Record<LLMProvider, string>;
  providerPriority: LLMProvider[];
}

export const agentConfigs: Record<AIAgentName, AgentConfig> = {
  grammar_tutor: {
    models: { "opencode-go": "deepseek-v4-pro", ollama: "qwen2.5:14b" },
    providerPriority: ["opencode-go", "ollama"],
  },
  cultural_guide: {
    models: { "opencode-go": "deepseek-v4-pro", ollama: "qwen2.5:14b" },
    providerPriority: ["opencode-go", "ollama"],
  },
  conversation_partner: {
    models: { "opencode-go": "deepseek-v4-pro", ollama: "qwen2.5:14b" },
    providerPriority: ["opencode-go", "ollama"],
  },
  pronunciation_coach: {
    models: { "opencode-go": "deepseek-v4-flash", ollama: "llama3.1:8b" },
    providerPriority: ["opencode-go", "ollama"],
  },
};
