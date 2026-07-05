import { NextResponse } from "next/server";
import { vivoChat, vivoChatStream } from "@/lib/vivo";
import { SYSTEM_PROMPTS } from "@/lib/prompts";
import { AICapability, MessageRole } from "@/lib/types";
import { fallbackForCapability } from "@/lib/fallback";

// 从最后一条用户消息中提取 fallback 上下文（意象/接收人等）
function extractFallbackContext(
  messages: { role: MessageRole; content: string }[]
): { imageryName?: string; receiverName?: string; raw?: string } {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return {};
  const text = lastUser.content;
  const imageryMatch = text.match(/意象[：:]\s*([^\s，,]+)/);
  const receiverMatch = text.match(/接收者[：:]\s*([^\s，,]+)/);
  return {
    imageryName: imageryMatch?.[1],
    receiverName: receiverMatch?.[1],
    raw: text,
  };
}

export async function POST(request: Request) {
  try {
    const { capability, messages, stream = false } = await request.json();

    if (!capability || !messages) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[capability as AICapability];
    if (!systemPrompt) {
      return NextResponse.json({ error: "Invalid capability" }, { status: 400 });
    }

    const fullMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: MessageRole; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // 演示兑底：API Key 缺失时直接返回 fallback，避免外网调用失败拖慢路演
    const hasApiKey = !!process.env.VIVO_API_KEY;
    if (!hasApiKey) {
      const ctx = extractFallbackContext(messages);
      const content = fallbackForCapability(capability as AICapability, ctx);
      return NextResponse.json({ content, fallback: true, reason: "no_api_key" });
    }

    if (stream) {
      const streamResponse = await vivoChatStream(
        capability as AICapability,
        fullMessages
      );

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResponse) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new NextResponse(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      try {
        const response = await vivoChat(
          capability as AICapability,
          fullMessages
        );
        const content = response.choices[0]?.message?.content || "";
        // 如果模型返回空内容，也兑底
        if (!content.trim()) {
          const ctx = extractFallbackContext(messages);
          return NextResponse.json({
            content: fallbackForCapability(capability as AICapability, ctx),
            fallback: true,
            reason: "empty_response",
          });
        }
        return NextResponse.json({ content });
      } catch (innerErr) {
        console.warn("AI call failed, using fallback:", innerErr);
        const ctx = extractFallbackContext(messages);
        return NextResponse.json({
          content: fallbackForCapability(capability as AICapability, ctx),
          fallback: true,
          reason: "ai_error",
        });
      }
    }
  } catch (error) {
    console.error("API error:", error);
    // 解析失败仍兑底，但带 400 含义需谨慎；这里仍 200 + fallback，保证 UI 不断流
    return NextResponse.json(
      {
        content: "愿你被温柔地理解。",
        fallback: true,
        reason: "request_error",
      },
      { status: 200 }
    );
  }
}
