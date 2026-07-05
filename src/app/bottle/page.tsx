"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/shared/Loading";
import Icon, { IconNames } from "@/components/shared/Icon";
import { useStore } from "@/lib/store";
import type { ImageryCard, DriftBottleMode } from "@/lib/types";

// ===== 意象卡片（imagery 模式） =====
const imageryCards: (ImageryCard & { iconName: string })[] = [
  { id: "1", name: "一盏暖灯", description: "愿这盏灯，温暖你的夜晚", icon: "🪔", iconName: IconNames.SPARKLE, category: "warmth" },
  { id: "2", name: "一杯热茶", description: "茶香袅袅，心意绵绵", icon: "🍵", iconName: IconNames.RIPPLE, category: "care" },
  { id: "3", name: "一封家书", description: "纸短情长，见字如面", icon: "✉️", iconName: IconNames.LETTER, category: "memory" },
  { id: "4", name: "雨后春笋", description: "新的开始，充满希望", icon: "🌱", iconName: IconNames.SPRING, category: "celebration" },
  { id: "5", name: "一个拥抱", description: "一个迟到的拥抱", icon: "🤗", iconName: IconNames.PROFILE, category: "apology" },
  { id: "6", name: "星空", description: "愿你眼中有星辰", icon: "⭐", iconName: IconNames.STAR, category: "warmth" },
  { id: "7", name: "落叶归根", description: "无论走多远，家在心中", icon: "🍂", iconName: IconNames.TREEHOLE, category: "memory" },
  { id: "8", name: "春风", description: "如春风般温柔", icon: "🌸", iconName: IconNames.WIND, category: "care" },
];

const categories = [
  { id: "all", label: "全部", iconName: IconNames.SPARKLE },
  { id: "warmth", label: "温暖", iconName: IconNames.SPRING },
  { id: "care", label: "关怀", iconName: IconNames.RIPPLE },
  { id: "apology", label: "歉意", iconName: IconNames.WIND },
  { id: "celebration", label: "祝福", iconName: IconNames.STAR },
  { id: "memory", label: "回忆", iconName: IconNames.LETTER },
];

// ===== 每日心情（daily 模式） =====
const moodOptions = [
  { id: "calm", label: "平静", emoji: "😌", iconName: IconNames.WEATHER, poem: "今天的风很轻，我也很好。愿你也是。" },
  { id: "happy", label: "开心", emoji: "😊", iconName: IconNames.STAR, poem: "今天有一件小事，让我想起你。想分享给你。" },
  { id: "tired", label: "累了", emoji: "😔", iconName: IconNames.RIPPLE, poem: "今天有点累，但想到你，觉得还好。" },
  { id: "grateful", label: "感恩", emoji: "🥰", iconName: IconNames.SPRING, poem: "谢谢有你。这句话，今天特别想说。" },
  { id: "miss", label: "想你", emoji: "💭", iconName: IconNames.LETTER, poem: "没什么特别的事，就是有点想你。" },
  { id: "proud", label: "骄傲", emoji: "🌟", iconName: IconNames.SPARKLE, poem: "为你骄傲。这句话，很久没说了。" },
];

// ===== 一键问候（greeting 模式） =====
const greetingOptions = [
  { id: "g1", text: "吃饭了吗？", poem: "吃饭了吗？没什么事，就是想问一句。" },
  { id: "g2", text: "路上小心", poem: "路上小心。慢一点，没关系。" },
  { id: "g3", text: "今天加油", poem: "今天加油。不用太拼，尽力就好。" },
  { id: "g4", text: "早点休息", poem: "早点休息。晚安，明天见。" },
  { id: "g5", text: "天冷加衣", poem: "天冷加衣。别感冒了，我会担心。" },
  { id: "g6", text: "今天开心吗", poem: "今天开心吗？想听听你的声音。" },
  { id: "g7", text: "辛苦了", poem: "辛苦了。这些年，你受累了。" },
  { id: "g8", text: "我爱你", poem: "我爱你。这句话，当面说不出口，写在心意里。" },
];

// ===== 模式定义 =====
type WriteMode = "imagery" | "daily" | "greeting";

// ===== 页面 =====
export default function BottlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const replyTo = searchParams.get("replyTo");
  const replyImagery = searchParams.get("imageryName");

  const {
    sendDriftBottle,
    isLoading,
    setLoading,
    error,
    setError,
    partnerMember,
    currentMember,
  } = useStore();

  // 模式
  const [writeMode, setWriteMode] = useState<WriteMode>("imagery");

  // imagery 模式
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImagery, setSelectedImagery] = useState<(ImageryCard & { iconName: string }) | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [poem, setPoem] = useState("");
  const [originalText, setOriginalText] = useState(""); // P6: 润色前原话

  // 流程状态
  const [step, setStep] = useState<"entry" | "confirm" | "preview" | "sent">("entry");

  // 来自 inbox 的回信（reply 模式）
  const isReply = !!replyTo;

  // ---------- 意象模式：筛选 ----------
  const filteredImagery = useMemo(
    () =>
      selectedCategory === "all"
        ? imageryCards
        : imageryCards.filter((c) => c.category === selectedCategory),
    [selectedCategory],
  );

  // ---------- 生成诗意（imagery + polish） ----------
  const handleGeneratePoem = async (rawText?: string) => {
    if (!selectedImagery || !partnerMember) return;
    setLoading(true);
    setError(null);

    const promptText = rawText
      ? `意象：${selectedImagery.name}，接收者：${partnerMember.displayName}，我想说的话：${rawText}。请帮我润色得更温柔、更含蓄，保留东方诗意。`
      : `意象：${selectedImagery.name}，接收者：${partnerMember.displayName}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "drift_bottle",
          messages: [{ role: "user", content: promptText }],
          stream: false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const fallback = rawText
        ? rawText.replace(/[!！]/g, "。").replace(/笨蛋|废物/g, "")
        : `愿这${selectedImagery.name}，带去我的心意。`;
      setPoem(data.content || fallback);
      if (rawText) setOriginalText(rawText);
      setStep("preview");
    } catch {
      setPoem(rawText || `愿这${selectedImagery.name}，带去我的心意。`);
      if (rawText) setOriginalText(rawText);
      setStep("preview");
    } finally {
      setLoading(false);
    }
  };

  // ---------- 发送 ----------
  const handleSend = async (mode: DriftBottleMode) => {
    if (!partnerMember) return;
    setLoading(true);

    try {
      await sendDriftBottle({
        senderId: currentMember?.id || "self",
        receiverId: partnerMember.id,
        imageryId: selectedImagery?.id || mode,
        imageryName: selectedImagery?.name || "每日心意",
        customMessage: customMessage || undefined,
        originalText: originalText || undefined,
        mode,
        poem: poem || "愿这份心意，被你温柔接住。",
        status: "sent",
        sentAt: Date.now(),
      });
      setStep("sent");
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } catch {
      setError("发送失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // ---------- 每日心情：一键发送 ----------
  const handleMoodSend = async (mood: (typeof moodOptions)[0]) => {
    if (!partnerMember) return;
    setLoading(true);
    try {
      await sendDriftBottle({
        senderId: currentMember?.id || "self",
        receiverId: partnerMember.id,
        imageryId: `mood_${mood.id}`,
        imageryName: `今日心情 · ${mood.label}`,
        poem: mood.poem,
        mode: "daily",
        status: "sent",
        sentAt: Date.now(),
      });
      setStep("sent");
      setTimeout(() => router.push("/"), 2500);
    } catch {
      setError("发送失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // ---------- 一键问候：一键发送 ----------
  const handleGreetingSend = async (g: (typeof greetingOptions)[0]) => {
    if (!partnerMember) return;
    setLoading(true);
    try {
      await sendDriftBottle({
        senderId: currentMember?.id || "self",
        receiverId: partnerMember.id,
        imageryId: `greeting_${g.id}`,
        imageryName: g.text,
        poem: g.poem,
        mode: "greeting",
        status: "sent",
        sentAt: Date.now(),
      });
      setStep("sent");
      setTimeout(() => router.push("/"), 2500);
    } catch {
      setError("发送失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // ---------- 重置 ----------
  const resetWrite = () => {
    setSelectedImagery(null);
    setCustomMessage("");
    setPoem("");
    setOriginalText("");
    setStep("entry");
  };

  // ============================
  // 发送成功
  // ============================
  if (step === "sent") {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-tianqing/20 via-oupink/10 to-mibai">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-oupink/30 to-tianqing/30 flex items-center justify-center mb-6 animate-bottle shadow-lg">
          <Icon name={IconNames.LETTER} size={48} className="text-white" />
        </div>
        <p className="text-xl text-gray-700 font-medium mb-2">已写进家庭时光</p>
        <p className="text-sm text-gray-500">
          {partnerMember ? `等待 ${partnerMember.displayName} 启阅` : "愿它漂到温暖的港湾"}
        </p>
        <div className="mt-5 w-20 h-1 bg-gradient-to-r from-transparent via-tianqing/30 to-transparent rounded-full animate-pulse" />
      </div>
    );
  }

  // ============================
  // 预览（P6：AI 润色对比）
  // ============================
  if (step === "preview" && selectedImagery) {
    const showPolishDiff = originalText && originalText !== poem;

    return (
      <div className="flex flex-col bg-gradient-to-b from-yuebai to-mibai">
        <header className="flex items-center px-4 py-3 bg-mibai/90 backdrop-blur-md border-b border-tianqing/10">
          <button
            type="button"
            onClick={() => setStep("confirm")}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 active:scale-95 transition-transform shadow-sm"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-semibold text-gray-700">心意预览</h1>
          </div>
          <div className="w-9" />
        </header>

        <div className="flex-1 px-5 py-6 flex flex-col items-center overflow-y-auto">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-oupink/20 to-tianqing/20 flex items-center justify-center mb-5 animate-glow shadow-md">
            <Icon name={selectedImagery.iconName} size={40} className="text-tianqing" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-1">{selectedImagery.name}</h2>
          <p className="text-xs text-gray-400 mb-4">{selectedImagery.description}</p>

          {partnerMember && (
            <p className="text-[11px] text-gray-400 tracking-widest mb-5">
              将送达 → {partnerMember.displayName}
            </p>
          )}

          {/* P6: AI 润色前后对比 */}
          {showPolishDiff && (
            <div className="w-full bg-amber-50/50 rounded-2xl p-4 mb-4 border border-amber-100">
              <p className="text-[10px] text-amber-600 tracking-widest mb-2 flex items-center gap-1">
                <Icon name={IconNames.SPARKLE} size={12} />
                AI 润色对比
              </p>
              <div className="space-y-2">
                <div className="bg-white/60 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-gray-400 mb-0.5">你想说的</p>
                  <p className="text-xs text-gray-500 line-through">{originalText}</p>
                </div>
                <div className="flex justify-center">
                  <Icon name={IconNames.WIND} size={14} className="text-amber-400" />
                </div>
                <div className="bg-white/60 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-gray-400 mb-0.5">AI 帮你说的</p>
                  <p className="text-xs text-gray-700">{poem}</p>
                </div>
              </div>
            </div>
          )}

          {/* 正文 */}
          {!showPolishDiff && (
            <div className="w-full bg-white rounded-3xl p-5 mb-4 border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 whitespace-pre-wrap text-center leading-8">
                {poem}
              </p>
            </div>
          )}

          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="添加一句悄悄话..."
            className="w-full bg-white rounded-full px-4 py-2.5 text-sm outline-none border border-gray-100 focus:border-tianqing/30 active:scale-[0.99] transition-all mb-6 shadow-sm"
          />

          <button
            type="button"
            onClick={() => handleSend(originalText ? "polish" : "imagery")}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-transform shadow-md"
          >
            {isLoading ? "投递中..." : "投出心意"}
          </button>

          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // ============================
  // 确认收件人 + 输入原话（imagery 模式）
  // ============================
  if (step === "confirm" && selectedImagery) {
    return (
      <div className="flex flex-col bg-gradient-to-b from-yuebai to-mibai">
        <header className="flex items-center px-4 py-3 bg-mibai/90 backdrop-blur-md border-b border-tianqing/10">
          <button
            type="button"
            onClick={resetWrite}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 active:scale-95 transition-transform shadow-sm"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-semibold text-gray-700">确认收件人</h1>
          </div>
          <div className="w-9" />
        </header>

        <div className="flex-1 px-5 py-5 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 mb-6 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-oupink/20 to-tianqing/20 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Icon name={selectedImagery.iconName} size={28} className="text-tianqing" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{selectedImagery.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{selectedImagery.description}</p>
          </div>

          <p className="text-xs text-gray-400 mb-3">这一份心意，将送达</p>

          {!partnerMember ? (
            <div className="rounded-2xl bg-yuebai/50 px-4 py-8 text-center border border-tianqing/10">
              <Icon name={IconNames.PROFILE} size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-2">还没有家庭成员</p>
              <p className="text-xs text-gray-400">请先邀请家人加入安语，再投出心意</p>
            </div>
          ) : (
            <div className="rounded-2xl p-4 flex items-center gap-3 bg-tianqing/10 border-2 border-tianqing/30 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yuebai to-mibai flex items-center justify-center text-gray-600 font-medium shadow-sm">
                {partnerMember.displayName.charAt(0)}
              </div>
              <div className="text-left flex-1">
                <h4 className="font-medium text-gray-700">{partnerMember.displayName}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{partnerMember.relation} · 已绑定</p>
              </div>
              <span className="w-7 h-7 rounded-full bg-tianqing/20 flex items-center justify-center text-tianqing text-sm font-medium">
                ✓
              </span>
            </div>
          )}

          {/* P6: 输入自己的原话，让 AI 润色 */}
          <div className="mt-6">
            <p className="text-xs text-gray-400 mb-2">
              你想说什么？（选填，AI 会帮你润色）
            </p>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="比如：妈，别老催我吃饭了..."
              rows={3}
              className="w-full bg-white rounded-2xl px-4 py-3 text-sm outline-none border border-gray-100 focus:border-tianqing/30 resize-none shadow-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => handleGeneratePoem(originalText || undefined)}
            disabled={!partnerMember || isLoading}
            className="w-full mt-5 bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-transform shadow-md"
          >
            {isLoading ? "生成中..." : originalText ? "AI 润色" : "生成诗意"}
          </button>

          {error && <p className="text-xs text-red-400 text-center mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // ============================
  // 入口页（三模式切换）
  // ============================
  const modeTabs: { key: WriteMode; label: string; icon: string }[] = [
    { key: "imagery", label: "意象寄送", icon: IconNames.SPARKLE },
    { key: "daily", label: "每日心情", icon: IconNames.WEATHER },
    { key: "greeting", label: "一键问候", icon: IconNames.LETTER },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-b from-yuebai to-mibai">
      <header className="flex items-center px-4 py-3 bg-mibai/90 backdrop-blur-md border-b border-tianqing/10">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 active:scale-95 transition-transform shadow-sm"
        >
          ←
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-gray-700">
            {isReply ? `回复 · ${replyImagery || "心意"}` : "为家书记一笔"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isReply ? "收到了，回一句" : "每一份心意，都会写进家庭的历史里"}
          </p>
        </div>
        <div className="w-9" />
      </header>

      {/* 模式切换 Tab */}
      <div className="flex px-5 py-3 gap-2 border-b border-gray-100/50">
        {modeTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setWriteMode(tab.key);
              resetWrite();
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
              writeMode === tab.key
                ? "bg-gradient-to-r from-tianqing to-oupink text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            <Icon
              name={tab.icon}
              size={12}
              className={writeMode === tab.key ? "text-white" : "text-gray-400"}
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== 意象寄送 ===== */}
      {writeMode === "imagery" && (
        <>
          <div className="flex overflow-x-auto px-5 py-3 border-b border-gray-100/50 chat-scroll">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs whitespace-nowrap mr-2 transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-tianqing to-oupink text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-100"
                }`}
              >
                <Icon
                  name={cat.iconName}
                  size={12}
                  className={selectedCategory === cat.id ? "text-white" : "text-gray-400"}
                />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 px-5 py-5 overflow-y-auto">
            {isLoading && <Loading text="加载中..." />}
            {filteredImagery.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-yuebai flex items-center justify-center mb-4 shadow-sm">
                  <Icon name={IconNames.LETTER} size={28} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-1">暂无此类意象</p>
                <p className="text-xs text-gray-400">试试其他分类</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredImagery.map((card, index) => (
                  <button
                    type="button"
                    key={card.id}
                    onClick={() => {
                      setSelectedImagery(card);
                      setStep("confirm");
                    }}
                    className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yuebai to-oupink/10 flex items-center justify-center mb-3 shadow-sm">
                      <Icon name={card.iconName} size={26} className="text-tianqing" />
                    </div>
                    <h3 className="font-medium text-gray-700 text-sm mb-1">{card.name}</h3>
                    <p className="text-xs text-gray-400 leading-4">{card.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== 每日心情 ===== */}
      {writeMode === "daily" && (
        <div className="flex-1 px-5 py-5 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-4 text-center">
            选一个今天的心情，一秒寄出
          </p>
          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleMoodSend(mood)}
                disabled={isLoading || !partnerMember}
                className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-center disabled:opacity-40"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yuebai to-oupink/10 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Icon name={mood.iconName} size={26} className="text-tianqing" />
                </div>
                <p className="font-medium text-gray-700 text-sm">{mood.label}</p>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{mood.poem}</p>
              </button>
            ))}
          </div>
          {error && <p className="text-xs text-red-400 text-center mt-3">{error}</p>}
        </div>
      )}

      {/* ===== 一键问候 ===== */}
      {writeMode === "greeting" && (
        <div className="flex-1 px-5 py-5 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-4 text-center">
            选一句，不用想，一秒送出
          </p>
          <div className="space-y-2">
            {greetingOptions.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGreetingSend(g)}
                disabled={isLoading || !partnerMember}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all text-left disabled:opacity-40"
              >
                <p className="font-medium text-gray-700 text-sm">{g.text}</p>
                <p className="text-[11px] text-gray-400 mt-1">{g.poem}</p>
              </button>
            ))}
          </div>
          {error && <p className="text-xs text-red-400 text-center mt-3">{error}</p>}
        </div>
      )}
    </div>
  );
}