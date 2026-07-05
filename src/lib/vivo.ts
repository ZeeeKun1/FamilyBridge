import OpenAI from "openai";
import { MODEL_MAP } from "./prompts";
import { AICapability, MessageRole } from "./types";

const client = new OpenAI({
  apiKey: process.env.VIVO_API_KEY || "",
  baseURL: process.env.VIVO_BASE_URL || "https://api-ai.vivo.com.cn/v1",
  defaultHeaders: {
    "Content-Type": "application/json; charset=utf-8",
  },
  dangerouslyAllowBrowser: false,
});

function buildParams(
  capability: AICapability,
  messages: { role: MessageRole; content: string }[],
  stream: boolean
) {
  const model = MODEL_MAP[capability] || "Doubao-Seed-2.0-mini";

  // systemPrompt 已由 route.ts 注入 messages 中，此处不再重复拼接
  const params: Record<string, unknown> = {
    model,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
    temperature: capability === "persona" ? 0.3 : 0.7,
    max_tokens: 4096,
    stream,
  };

  // Disable thinking for all models — vivo contest API may not support it
  // (previously only enabled for persona/simulation on deepseek models)

  return params;
}

export async function vivoChat(
  capability: AICapability,
  messages: { role: MessageRole; content: string }[]
) {
  const params = buildParams(capability, messages, false);
  return client.chat.completions.create(
    params as unknown as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
  );
}

export async function vivoChatStream(
  capability: AICapability,
  messages: { role: MessageRole; content: string }[]
) {
  const params = buildParams(capability, messages, true);
  return client.chat.completions.create(
    params as unknown as OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming
  );
}

export async function handleAIChat(
  capability: AICapability,
  userMessage: string,
  history: { role: MessageRole; content: string }[] = []
) {
  const messages = [
    ...history,
    { role: "user" as const, content: userMessage },
  ];
  const response = await vivoChat(capability, messages);
  const content = response.choices[0]?.message?.content || "";
  return content;
}
