"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/shared/Loading";
import VoiceInput from "@/components/shared/VoiceInput";
import { useStore } from "@/lib/store";
import { Message } from "@/lib/types";

export default function TreeholePage() {
  const router = useRouter();
  const store = useStore();
  const {
    currentConversation,
    startConversation,
    addMessage,
    endConversation,
    isLoading,
    setLoading,
    error,
    setError,
    updateEmotionWeather,
  } = store;

  const [input, setInput] = useState("");
  const [isSummary, setIsSummary] = useState(false);
  const [summaryReady, setSummaryReady] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [showBreathing, setShowBreathing] = useState(false);
  const [floatingLeaves, setFloatingLeaves] = useState<{ id: number; x: number; delay: number }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentConversation || currentConversation.type !== "treehole") {
      startConversation("treehole");
    }
    setIsSummary(false);
    setSummaryReady(false);
    setSummaryContent("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, summaryContent]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentConversation?.messages.length && !isSummary) {
        setFloatingLeaves((prev) => [
          ...prev.slice(-5),
          { id: Date.now(), x: 20 + Math.random() * 60, delay: Math.random() * 2 },
        ]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentConversation?.messages, isSummary]);

  const buildListenMessages = useCallback(
    (userText: string) => {
      return [
        ...(currentConversation?.messages || [])
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: userText },
      ];
    },
    [currentConversation?.messages]
  );

  const handleSend = useCallback(
    async (text?: string) => {
      const msgText = text || input;
      if (!msgText.trim() || isLoading || isSummary) return;
      setInput("");
      setLoading(true);
      setError(null);

      const userMsg: Message = {
        id: Date.now().toString(36),
        role: "user",
        content: msgText.trim(),
        timestamp: Date.now(),
      };
      addMessage(userMsg);

      try {
        const messages = buildListenMessages(msgText.trim());
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            capability: "treehole_listen",
            messages,
            stream: true,
          }),
        });

        if (!res.ok) throw new Error("API error");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullContent = "";
        const aiMsgId = (Date.now() + 1).toString(36);
        addMessage({
          id: aiMsgId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.content) {
                  fullContent += parsed.content;
                  const conv = useStore.getState().currentConversation;
                  if (conv) {
                    const msgs = [...conv.messages];
                    const last = msgs[msgs.length - 1];
                    if (last && last.id === aiMsgId) {
                      msgs[msgs.length - 1] = { ...last, content: fullContent };
                      useStore.setState({ currentConversation: { ...conv, messages: msgs } });
                    }
                  }
                }
              } catch { /* skip parse errors */ }
            }
          }
        }
      } catch {
        setError("连接失败，请重试");
      } finally {
        setLoading(false);
      }
    },
    [input, isLoading, isSummary, addMessage, buildListenMessages, setError, setLoading]
  );

  const handleBreathing = () => {
    setShowBreathing(true);
    setTimeout(() => setShowBreathing(false), 6000);
  };

  // #5 + #10：梳理思绪 — 调用 treehole_summary + 写入情绪气象
  const handleSummary = useCallback(async () => {
    const messages = currentConversation?.messages || [];
    if (messages.length === 0 || isSummary) return;
    setIsSummary(true);
    setSummaryReady(false);
    setLoading(true);

    try {
      const userMessages = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "treehole_summary",
          messages: userMessages,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error("Summary failed");
      const data = await res.json();
      const content = data.content || "今天的心情，值得被温柔地记录。";
      setSummaryContent(content);
      setSummaryReady(true);

      // #5：尝试从 AI 返回中提取情绪数据写入气象
      try {
        const parsed = JSON.parse(content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim());
        const emotion = parsed.primary_emotion || parsed.emotion || "平静";
        const intensity = Math.min(100, Math.max(0, Number(parsed.intensity) || 40));
        await updateEmotionWeather({
          state: intensity > 70 ? "storm" : intensity > 40 ? "wave" : intensity > 15 ? "ripple" : "calm",
          primaryEmotion: emotion,
          intensity,
          trend: "stable",
          timestamp: Date.now(),
        });
      } catch {
        // 解析失败时写入默认温和情绪
        await updateEmotionWeather({
          state: "calm",
          primaryEmotion: "平静",
          intensity: 30,
          trend: "stable",
          timestamp: Date.now(),
        });
      }
    } catch {
      setError("梳理失败，请重试");
      setIsSummary(false);
    } finally {
      setLoading(false);
    }
  }, [currentConversation, isSummary, setLoading, setError, updateEmotionWeather]);

  const hasMessages = (currentConversation?.messages.length ?? 0) > 0;

  return (
    <div className="flex flex-col bg-gradient-to-b from-green-50/50 via-yuebai to-mibai">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingLeaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute text-green-300 text-lg animate-fall"
            style={{
              left: `${leaf.x}%`,
              top: "-20px",
              animationDelay: `${leaf.delay}s`,
            }}
          >
            🍃
          </div>
        ))}
      </div>

      {showBreathing && (
        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/10 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-tianqing/15 to-oupink/10 flex items-center justify-center animate-breathing">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-tianqing/25 to-oupink/15 flex items-center justify-center animate-breathing" style={{ animationDelay: "0.5s" }}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tianqing/40 to-oupink/25 flex items-center justify-center animate-breathing" style={{ animationDelay: "1s" }}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
                      <span className="text-white/90 text-xs font-medium tracking-[0.3em]">呼...吸...</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 w-36 h-36 rounded-full border border-tianqing/10 animate-breathing" style={{ animationDelay: "0.3s" }} />
              <div className="absolute inset-[-8px] w-52 h-52 rounded-full border border-tianqing/5 animate-breathing" style={{ animationDelay: "0.7s" }} />
            </div>
            <p className="text-white/90 text-sm tracking-[0.2em]">跟随呼吸，慢慢放松</p>
            <button
              type="button"
              onClick={() => setShowBreathing(false)}
              className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs hover:bg-white/20 transition-all active:scale-95"
            >
              完成
            </button>
          </div>
        </div>
      )}

      <header className="relative z-10 flex items-center px-4 py-3 bg-mibai/90 backdrop-blur-md border-b border-green-100/50">
        <button
          type="button"
          onClick={async () => {
            await endConversation();
            router.push("/");
          }}
          className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 active:scale-95 transition-transform"
        >
          ←
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-gray-700">思绪森林</h1>
          <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">想说啥说啥，我在这儿听</p>
        </div>
        <button
          type="button"
          onClick={handleBreathing}
          className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-500 active:scale-95 transition-transform"
        >
          🌿
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 chat-scroll">
        {!hasMessages && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5 shadow-sm">
              <span className="text-3xl">🌲</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">这里是思绪森林</p>
            <p className="text-xs text-gray-400 leading-6 max-w-[240px]">
              轻轻说出你的心事<br />我会在这里安静地倾听
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-500">倾听中</span>
            </div>
          </div>
        )}

        {currentConversation?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-[20px] px-5 py-3.5 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-tianqing to-tianqing/85 text-white rounded-br-md shadow-md shadow-tianqing/20"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 rounded-bl-md border border-white/80 shadow-soft"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && !isSummary && (
          <div className="flex items-center gap-2 py-2">
            <div className="w-2 h-2 rounded-full bg-tianqing/50 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-tianqing/50 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-tianqing/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="text-xs text-gray-400 ml-1">倾听中...</span>
          </div>
        )}
        {isLoading && isSummary && <Loading text="正在梳理思绪..." />}

        {error && (
          <div className="text-center text-xs text-red-400 py-3 bg-red-50 rounded-xl mt-2">
            {error}
            <button type="button" onClick={() => setError(null)} className="ml-3 text-tianqing underline">
              关闭
            </button>
          </div>
        )}

        {summaryReady && (
          <div className="bg-white rounded-3xl p-5 mt-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💭</span>
              <h3 className="font-semibold text-gray-700">心灵回响</h3>
            </div>
            <p className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">{summaryContent}</p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => router.push("/bottle")}
                className="flex-1 bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-3 text-sm font-medium active:scale-[0.98] transition-transform shadow-sm"
              >
                传递心意
              </button>
              <button
                type="button"
                onClick={async () => {
                  await endConversation();
                  router.push("/");
                }}
                className="flex-1 bg-gray-100 text-gray-600 rounded-2xl py-3 text-sm active:scale-[0.98] transition-transform"
              >
                回到心湖
              </button>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {!isSummary && (
        <div className="relative z-10 px-4 pb-4 pt-2 bg-mibai/90 backdrop-blur-md border-t border-gray-100/50">
          <VoiceInput
            value={input}
            onChange={setInput}
            onVoiceComplete={(text) => setInput(text)}
            placeholder="说出你的心事..."
            className=""
          />
          <div className="flex items-center justify-between mt-2 px-1">
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="text-xs text-gray-400 hover:text-tianqing disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              按发送或说&quot;发送&quot;来传递
            </button>
            {hasMessages && (
              <button
                type="button"
                onClick={handleSummary}
                disabled={isLoading}
                className="text-xs text-tianqing hover:text-tianqing/80 disabled:opacity-40 transition-colors"
              >
                💭 梳理思绪
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
