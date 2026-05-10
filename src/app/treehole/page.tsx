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

  return (
    <div className="flex flex-col h-screen">
      {/* 思绪森林背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 树叶飘落效果 */}
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

      {/* 呼吸引导遮罩 */}
      {showBreathing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-tianqing/30 animate-breathing flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-tianqing/50 animate-breathing flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-tianqing/70 animate-breathing flex items-center justify-center">
                  <span className="text-white text-xs font-song">呼...吸...</span>
                </div>
              </div>
            </div>
            <p className="text-white/80 text-xs">跟随呼吸，慢慢放松</p>
            <button
              onClick={() => setShowBreathing(false)}
              className="text-white/60 text-xs underline"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <header className="flex items-center px-4 py-3 border-b border-gray-100 bg-mibai/80 backdrop-blur-sm">
        <button
          onClick={async () => {
            await endConversation();
            router.back();
          }}
          className="text-lg mr-3"
        >
          ←
        </button>
        <h1 className="font-semibold flex-1 text-center">思绪森林</h1>
        <button
          onClick={handleBreathing}
          className="text-xs text-gray-400 bg-gray-100 rounded-lg px-2 py-1"
        >
          呼吸
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 chat-scroll">
        <div className="text-xs text-gray-400 text-center mb-3">
          — 想说啥说啥，我在这儿听 —
        </div>

        {currentConversation?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                msg.role === "user"
                  ? "bg-tianqing text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && !isSummary && <Loading text="倾听中..." />}
        {isLoading && isSummary && <Loading text="正在梳理思绪..." />}

        {error && (
          <div className="text-center text-xs text-gray-400 py-2">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-tianqing underline">
              重试
            </button>
          </div>
        )}

        {summaryReady && (
          <div className="bg-yuebai rounded-2xl p-4 mt-4 border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-2">💭 心灵回响</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{summaryContent}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => router.push("/bottle")}
                className="flex-1 bg-tianqing text-white rounded-xl py-2 text-sm font-medium"
              >
                传递心意
              </button>
              <button
                onClick={async () => {
                  await endConversation();
                  router.push("/");
                }}
                className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2 text-sm"
              >
                回到心湖
              </button>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {!isSummary && (
        <div className="px-4 pb-4 bg-mibai/80 backdrop-blur-sm">
          <VoiceInput
            value={input}
            onChange={setInput}
            onVoiceComplete={(text) => setInput(text)}
            placeholder="说出你的心事..."
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-full mt-3 bg-tianqing text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40"
          >
            {isLoading ? "发送中..." : "发送"}
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            🔒 心事仅在本地处理
          </p>
        </div>
      )}
    </div>
  );
}
