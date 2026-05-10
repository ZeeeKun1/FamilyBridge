"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionCard from "@/components/invite/QuestionCard";
import Loading from "@/components/shared/Loading";
import { ParentId, PersonalityProfile } from "@/lib/types";
import { saveParentProfile } from "@/lib/db";

const QUESTIONS = [
  {
    question: "当您和孩子有分歧时，您通常会怎么做？",
    choices: [
      { value: "a", label: "坚持自己的想法，孩子应该听长辈的" },
      { value: "b", label: "先听孩子说完，再一起商量" },
      { value: "c", label: "觉得孩子还小不懂事，不急着解决" },
    ],
  },
  {
    question: "您最看重孩子的哪个方面？",
    choices: [
      { value: "a", label: "听话孝顺" },
      { value: "b", label: "独立自主" },
      { value: "c", label: "开心快乐" },
    ],
  },
  {
    question: "您觉得孩子和您沟通时最大的问题是什么？",
    choices: [
      { value: "a", label: "孩子不愿意主动找我说话" },
      { value: "b", label: "没说几句就吵起来了" },
      { value: "c", label: "孩子总觉得我说得不对" },
    ],
  },
  {
    question: "您希望在孩子心目中是什么形象？",
    choices: [
      { value: "a", label: "有威严的长辈" },
      { value: "b", label: "可以倾诉的朋友" },
      { value: "c", label: "默默支持的后盾" },
    ],
  },
  {
    question: "您最常对孩子说的一句话更接近？",
    choices: [
      { value: "a", label: "我这是为你好" },
      { value: "b", label: "你看看别人家孩子" },
      { value: "c", label: "你开心就好" },
    ],
  },
];

function InviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentParam = searchParams.get("parent") || "mom";
  const parentId: ParentId = parentParam === "dad" ? "dad" : "mom";

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openAnswer, setOpenAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentId>(parentId);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsLoading(true);
    setError(null);

    try {
      const answerText = QUESTIONS.map((q, i) => {
        const selectedChoice = q.choices.find((c) => c.value === answers[i]);
        return `Q${i + 1}: ${q.question} → ${selectedChoice?.label || ""}`;
      }).join("\n");

      const fullText = `${answerText}\n\n开放问题 - 最想对孩子说的一句话：${openAnswer || "（未填写）"}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "persona",
          messages: [
            {
              role: "user",
              content: `请分析以下${selectedParent === "mom" ? "母亲" : "父亲"}的问卷回答，生成人格档案：\n${fullText}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Invite API error:", res.status, errText);
        throw new Error("API error");
      }
      const data = await res.json();
      if (!data.content) throw new Error("Empty response");

      // Robust JSON parsing — handle markdown code blocks
      const cleaned = data.content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      let result: Record<string, unknown> | null = null;
      try {
        result = JSON.parse(cleaned);
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          try { result = JSON.parse(match[0]); } catch { /* skip */ }
        }
      }

      if (!result || !result.personality_profile) {
        console.error("Failed to parse persona result:", data.content);
        throw new Error("Parse error");
      }

      await saveParentProfile({
        id: selectedParent,
        displayName: selectedParent === "mom" ? "妈妈" : "爸爸",
        profile: result.personality_profile as unknown as PersonalityProfile,
        linked: true,
        updatedAt: Date.now(),
      });

      router.push("/profile");
    } catch (e) {
      console.error("Invite submit failed:", e);
      setError("提交失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-lg mr-3">
          ←
        </button>
        <h1 className="font-semibold flex-1">代际沟通桥 — 了解彼此</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="text-center mb-2">
          <p className="text-sm text-gray-600">
            您的孩子邀请您参与，帮助建立更准确的家庭画像
          </p>
          <p className="text-xs text-gray-400 mt-1">
            共 5 道选择题 + 1 道开放题，约 3 分钟
          </p>
        </div>

        {/* 身份切换 */}
        <div className="flex justify-center gap-2">
          {(["mom", "dad"] as ParentId[]).map((id) => (
            <button
              key={id}
              onClick={() => setSelectedParent(id)}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                selectedParent === id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              我是{id === "mom" ? "妈妈" : "爸爸"}
            </button>
          ))}
        </div>

        {/* 选择题 */}
        <div className="space-y-3">
          <div className="text-xs text-gray-400 font-medium">📝 选择题</div>
          {QUESTIONS.map((q, i) => (
            <QuestionCard
              key={i}
              index={i}
              question={q.question}
              choices={q.choices}
              selected={answers[i] || null}
              onSelect={(v) => handleSelect(i, v)}
            />
          ))}
        </div>

        {/* 开放题 */}
        <div className="bg-white rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-400 mb-2">💬 开放题</div>
          <p className="text-sm font-medium text-gray-800 mb-3">
            您最想对孩子说的一句话是？
          </p>
          <textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="写下您想说的话..."
            className="w-full bg-gray-50 rounded-lg p-3 text-sm outline-none resize-none min-h-[80px]"
            rows={3}
          />
        </div>

        {/* 错误 */}
        {error && (
          <div className="text-center text-xs text-gray-400 py-2">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-primary underline"
            >
              重试
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && <Loading text="正在生成画像..." />}

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isLoading}
          className="w-full bg-primary text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40 mt-2"
        >
          提交 →
        </button>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<Loading text="加载中..." />}>
      <InviteForm />
    </Suspense>
  );
}
