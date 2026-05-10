"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import { useStore } from "@/lib/store";
import { ImageryCard } from "@/lib/types";

const imageryCards: ImageryCard[] = [
  { id: "1", name: "一盏暖灯", description: "愿这盏灯，温暖你的夜晚", icon: "🪔", category: "warmth" },
  { id: "2", name: "一杯热茶", description: "茶香袅袅，心意绵绵", icon: "🍵", category: "care" },
  { id: "3", name: "一封家书", description: "纸短情长，见字如面", icon: "✉️", category: "memory" },
  { id: "4", name: "雨后春笋", description: "新的开始，充满希望", icon: "🌱", category: "celebration" },
  { id: "5", name: "一个拥抱", description: "一个迟到的拥抱", icon: "🤗", category: "apology" },
  { id: "6", name: "星空", description: "愿你眼中有星辰", icon: "⭐", category: "warmth" },
  { id: "7", name: "落叶归根", description: "无论走多远，家在心中", icon: "🍂", category: "memory" },
  { id: "8", name: "春风", description: "如春风般温柔", icon: "🌸", category: "care" },
];

const categories = [
  { id: "all", label: "全部", icon: "✨" },
  { id: "warmth", label: "温暖", icon: "🔥" },
  { id: "care", label: "关怀", icon: "💝" },
  { id: "apology", label: "歉意", icon: "🙏" },
  { id: "celebration", label: "祝福", icon: "🎉" },
  { id: "memory", label: "回忆", icon: "📖" },
];

export default function BottlePage() {
  const router = useRouter();
  const {
    parentProfiles,
    loadParentProfiles,
    sendDriftBottle,
    isLoading,
    setLoading,
    error,
    setError,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImagery, setSelectedImagery] = useState<ImageryCard | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [poem, setPoem] = useState("");
  const [showSentSuccess, setShowSentSuccess] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadParentProfiles();
    }
  }, [loadParentProfiles]);

  const filteredImagery = selectedCategory === "all"
    ? imageryCards
    : imageryCards.filter((card) => card.category === selectedCategory);

  const handleImagerySelect = (card: ImageryCard) => {
    setSelectedImagery(card);
  };

  const handleGeneratePoem = async () => {
    if (!selectedImagery || !selectedReceiver) return;
    
    setLoading(true);
    setError(null);
    
    const receiverName = parentProfiles.find((p) => p.id === selectedReceiver)?.displayName || "家人";
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "drift_bottle",
          messages: [{ role: "user", content: `意象：${selectedImagery.name}，接收者：${receiverName}` }],
          stream: false,
        }),
      });

      if (!res.ok) throw new Error("生成失败");
      
      const data = await res.json();
      setPoem(data.content || `愿这${selectedImagery.name}，带去我的心意。`);
      setShowPreview(true);
    } catch {
      setError("诗意生成失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedImagery || !selectedReceiver || !poem) return;
    
    setLoading(true);
    
    try {
      await sendDriftBottle({
        senderId: "self",
        receiverId: selectedReceiver,
        imageryId: selectedImagery.id,
        imageryName: selectedImagery.name,
        customMessage: customMessage || undefined,
        poem,
        status: "sent",
        sentAt: Date.now(),
      });
      
      setShowSentSuccess(true);
      setTimeout(() => {
        setShowSentSuccess(false);
        router.push("/");
      }, 2500);
    } catch {
      setError("发送失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (showSentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-tianqing/20 via-oupink/10 to-mibai">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-oupink/30 to-tianqing/30 flex items-center justify-center mb-6 animate-bottle shadow-lg">
          <span className="text-5xl">🏺</span>
        </div>
        <p className="text-xl text-gray-700 mb-2">漂流瓶已寄出</p>
        <p className="text-xs text-gray-400">愿它漂到温暖的港湾</p>
        <div className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-tianqing/30 to-transparent rounded-full animate-pulse" />
      </div>
    );
  }

  if (showPreview && selectedImagery) {
    return (
      <div className="flex flex-col h-screen bg-mibai">
        <header className="flex items-center px-5 py-4 border-b border-tianqing/10">
          <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-yuebai flex items-center justify-center text-gray-500 mr-3">←</button>
          <h1 className="font-semibold text-gray-700">心意预览</h1>
        </header>

        <div className="flex-1 px-5 py-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-oupink/20 to-tianqing/20 flex items-center justify-center mb-4 animate-glow">
            <span className="text-4xl">{selectedImagery.icon}</span>
          </div>
          
          <h2 className="text-xl text-gray-700 mb-1">{selectedImagery.name}</h2>
          <p className="text-xs text-gray-400 mb-6">{selectedImagery.description}</p>

          <div className="w-full bg-yuebai rounded-2xl p-5 mb-4 border border-tianqing/10">
            <p className="text-sm text-gray-600 whitespace-pre-wrap text-center leading-relaxed">
              {poem}
            </p>
          </div>

          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="添加一句悄悄话..."
            className="w-full bg-yuebai rounded-full px-4 py-2.5 text-sm outline-none border border-tianqing/10 focus:border-tianqing/30 transition-colors mb-6"
          />

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-tianqing to-oupink text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40 shadow-md"
          >
            {isLoading ? "投递中..." : "投出漂流瓶"}
          </button>

          {error && (
            <p className="text-xs text-red-400 mt-3">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (selectedImagery && !showPreview) {
    return (
      <div className="flex flex-col h-screen bg-mibai">
        <header className="flex items-center px-5 py-4 border-b border-tianqing/10">
          <button onClick={() => setSelectedImagery(null)} className="w-10 h-10 rounded-full bg-yuebai flex items-center justify-center text-gray-500 mr-3">←</button>
          <h1 className="font-semibold text-gray-700">选择接收人</h1>
        </header>

        <div className="flex-1 px-5 py-6">
          <div className="bg-gradient-to-br from-yuebai to-oupink/10 rounded-2xl p-5 mb-6 text-center border border-tianqing/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-oupink/20 to-tianqing/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">{selectedImagery.icon}</span>
            </div>
            <h3 className="text-lg text-gray-700">{selectedImagery.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{selectedImagery.description}</p>
          </div>

          <p className="text-xs text-gray-400 mb-3">选择要传递心意的家人</p>
          
          <div className="space-y-3">
            {parentProfiles.map((parent) => (
              <button
                key={parent.id}
                onClick={() => setSelectedReceiver(parent.id)}
                className={`w-full rounded-xl p-4 flex items-center gap-3 transition-all ${
                  selectedReceiver === parent.id
                    ? "bg-tianqing/10 border-2 border-tianqing/30"
                    : "bg-yuebai border border-tianqing/10"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yuebai to-mibai flex items-center justify-center text-gray-600 font-medium shadow-sm">
                  {parent.displayName.charAt(0)}
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-medium text-gray-700">{parent.displayName}</h4>
                  <p className="text-xs text-gray-400">点击选择</p>
                </div>
                {selectedReceiver === parent.id && (
                  <span className="w-6 h-6 rounded-full bg-tianqing/20 flex items-center justify-center text-tianqing text-sm">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleGeneratePoem}
            disabled={!selectedReceiver || isLoading}
            className="w-full mt-6 bg-gradient-to-r from-tianqing to-oupink text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40 shadow-md"
          >
            {isLoading ? "生成中..." : "生成诗意"}
          </button>

          {error && (
            <p className="text-xs text-red-400 text-center mt-3">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-mibai">
      <header className="flex items-center px-5 py-4 border-b border-tianqing/10">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-yuebai flex items-center justify-center text-gray-500 mr-3">←</button>
        <h1 className="font-semibold text-gray-700">心意花园</h1>
      </header>

      <div className="flex overflow-x-auto px-5 py-3 border-b border-gray-50 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs whitespace-nowrap mr-2 transition-all ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-tianqing to-oupink text-white shadow-sm"
                : "bg-yuebai text-gray-500"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto">
        {isLoading && <Loading text="加载中..." />}
        
        <div className="grid grid-cols-2 gap-3">
          {filteredImagery.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleImagerySelect(card)}
              className="bg-yuebai rounded-2xl p-4 border border-tianqing/10 card-hover animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yuebai to-oupink/10 flex items-center justify-center mb-3 shadow-sm">
                <span className="text-3xl">{card.icon}</span>
              </div>
              <h3 className="font-medium text-gray-700 text-sm">{card.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            选择一个意象，传递你的心意
          </p>
        </div>
      </div>
    </div>
  );
}
