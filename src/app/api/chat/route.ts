import { NextResponse } from "next/server";
import { vivoChat, vivoChatStream } from "@/lib/vivo";
import { SYSTEM_PROMPTS } from "@/lib/prompts";
import { AICapability, MessageRole } from "@/lib/types";

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
      const response = await vivoChat(
        capability as AICapability,
        fullMessages
      );

      const content = response.choices[0]?.message?.content || "";
      return NextResponse.json({ content });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
