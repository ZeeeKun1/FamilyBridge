"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import { useStore } from "@/lib/store";
import { TranslationResult } from "@/lib/types";

export default function TranslatePage() {
  const router = useRouter();
  const { isLoading, setLoading, error, setError } = useStore();

  const [inputText, setInputText] = useState("");
  const [selectedParent, setSelectedParent] = useState("mom");
  const [result, setResult] = useState<TranslationResult | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "translate",
          messages: [{ role: "user", content: inputText.trim() }],
          stream: false,
        }),
      });

      if (!res.ok) throw new Error("翻译失败");

      const data = await res.json();
      const content = data.content || "";

      try {
        const parsed = JSON.parse(content);
        setResult({
          originalText: inputText.trim(),
          translatedText: parsed.interpretation || "暂无解释",
          interpretation: parsed.interpretation || "暂无解释",
          emotionalIntent: parsed.emotionalIntent || "未知",
          suggestedResponse: parsed.suggestedResponse || "",
        });
      } catch {
        // 如果不是JSON格式，直接显示内容
        setResult({
          originalText: inputText.trim(),
          translatedText: content,
          interpretation: content,
          emotionalIntent: "未知",
          suggestedResponse: "",
        });
      }
    } catch {
      setError("解读失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-lg mr-3">←</button>
        <h1 className="font-semibold font-song">代际翻译器</h1>
      </header>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <p className="text-xs text-gray-400 mb-4">
          输入家人的话，帮你解读背后的心意
        </p>

        {/* 选择说话人 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedParent("mom")}
            className={`flex-1 py-2 rounded-xl text-sm transition-all ${
              selectedParent === "mom"
                ? "bg-tianqing text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            妈妈说
          </button>
          <button
            onClick={() => setSelectedParent("dad")}
            className={`flex-1 py-2 rounded-xl text-sm transition-all ${
              selectedParent === "dad"
                ? "bg-tianqing text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            爸爸说
          </button>
        </div>

        {/* 输入框 */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="把家人说的话写在这里..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none min-h-[100px]"
            rows={4}
          />
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading}
            className="w-full mt-3 bg-tianqing text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40"
          >
            {isLoading ? "解读中..." : "解读心意"}
          </button>
        </div>

        {isLoading && <Loading text="正在理解..." />}

        {error && (
          <div className="text-center text-xs text-red-400 py-2">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-tianqing underline">
              重试
            </button>
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="space-y-4">
            {/* 原始话语 */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="text-xs text-gray-400 mb-2">TA说</h3>
              <p className="text-sm text-gray-700">{result.originalText}</p>
            </div>

            {/* 情感意图 */}
            <div className="bg-oupink/20 rounded-2xl p-4">
              <h3 className="text-xs text-gray-400 mb-2">💝 真实情感</h3>
              <span className="inline-block bg-oupink/30 text-gray-600 text-xs px-2 py-1 rounded-full">
                {result.emotionalIntent}
              </span>
            </div>

            {/* 解读 */}
            <div className="bg-tianqing/10 rounded-2xl p-4">
              <h3 className="text-xs text-gray-400 mb-2">🔍 TA真正想说</h3>
              <p className="text-sm text-gray-700 font-song">{result.interpretation}</p>
            </div>

            {/* 建议回应 */}
            {result.suggestedResponse && (
              <div className="bg-green-50 rounded-2xl p-4">
                <h3 className="text-xs text-gray-400 mb-2">💡 可以这样回应</h3>
                <p className="text-sm text-green-700">{result.suggestedResponse}</p>
              </div>
            )}

            {/* 继续按钮 */}
            <button
              onClick={() => {
                setInputText("");
                setResult(null);
              }}
              className="w-full bg-gray-100 text-gray-600 rounded-xl py-2.5 text-sm"
            >
              解读另一句话
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
