"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import { useStore } from "@/lib/store";
import { MemoryItem } from "@/lib/types";

export default function CapsulePage() {
  const router = useRouter();
  const {
    timeCapsules,
    loadTimeCapsules,
    createTimeCapsule,
    isLoading,
    setLoading,
    error,
    setError,
  } = useStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memories, setMemories] = useState<Omit<MemoryItem, "id">[]>([]);
  const [newMemoryText, setNewMemoryText] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadTimeCapsules();
    }
  }, [loadTimeCapsules]);

  const handleAddMemory = () => {
    if (!newMemoryText.trim()) return;
    
    setMemories([
      ...memories,
      {
        type: "text",
        content: newMemoryText.trim(),
        timestamp: Date.now(),
        tags: [],
      },
    ]);
    setNewMemoryText("");
  };

  const handleCreateCapsule = async () => {
    if (!title.trim() || memories.length === 0) {
      setError("请填写标题并添加至少一个记忆");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTimeCapsule({
        title: title.trim(),
        description: description.trim() || undefined,
        memories: memories.map((m, index) => ({
          ...m,
          id: `memory-${index}-${Date.now()}`,
        })),
        createdAt: Date.now(),
        sharedWith: [],
      });

      setShowCreateForm(false);
      setTitle("");
      setDescription("");
      setMemories([]);
    } catch {
      setError("创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 创建胶囊表单
  if (showCreateForm) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center px-4 py-3 border-b border-gray-100">
          <button onClick={() => setShowCreateForm(false)} className="text-lg mr-3">←</button>
          <h1 className="font-semibold font-song">创建时光胶囊</h1>
        </header>

        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {/* 标题 */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">胶囊名称</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给这个胶囊起个名字..."
                className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>

            {/* 描述 */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">描述（可选）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="写一段描述..."
                className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none resize-none min-h-[60px]"
                rows={2}
              />
            </div>

            {/* 添加记忆 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">添加记忆</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newMemoryText}
                  onChange={(e) => setNewMemoryText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMemory()}
                  placeholder="记录一个美好瞬间..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleAddMemory}
                  disabled={!newMemoryText.trim()}
                  className="w-9 h-9 rounded-full bg-tianqing text-white flex items-center justify-center disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* 已添加的记忆 */}
              {memories.length > 0 && (
                <div className="space-y-2">
                  {memories.map((mem, index) => (
                    <div
                      key={index}
                      className="bg-yuebai rounded-xl p-3 flex items-start gap-2"
                    >
                      <span className="text-xs text-gray-400 mt-0.5">📝</span>
                      <p className="text-sm text-gray-700 flex-1">{mem.content}</p>
                      <button
                        onClick={() => setMemories(memories.filter((_, i) => i !== index))}
                        className="text-xs text-gray-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <button
              onClick={handleCreateCapsule}
              disabled={isLoading || !title.trim() || memories.length === 0}
              className="w-full bg-tianqing text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40"
            >
              {isLoading ? "创建中..." : "封存胶囊"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 主页面
  return (
    <div className="flex flex-col h-screen pb-16">
      <header className="flex items-center px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-lg mr-3">←</button>
        <h1 className="font-semibold font-song">时光胶囊</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="text-xs text-tianqing bg-tianqing/10 rounded-lg px-2 py-1"
        >
          + 新建
        </button>
      </header>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {isLoading && <Loading text="加载中..." />}

        {!isLoading && timeCapsules.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏳</span>
            </div>
            <p className="text-gray-500 text-sm mb-2">还没有时光胶囊</p>
            <p className="text-gray-400 text-xs">记录生活中的美好瞬间</p>
          </div>
        )}

        {timeCapsules.length > 0 && (
          <div className="space-y-4">
            {timeCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 font-song">{capsule.title}</h3>
                  <span className="text-xs text-gray-400">
                    {formatDate(capsule.createdAt)}
                  </span>
                </div>
                
                {capsule.description && (
                  <p className="text-xs text-gray-500 mb-3">{capsule.description}</p>
                )}

                <div className="space-y-2">
                  {capsule.memories.slice(0, 3).map((mem) => (
                    <div key={mem.id} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 truncate flex-1">
                        {mem.content.length > 30 ? mem.content.slice(0, 30) + "..." : mem.content}
                      </span>
                    </div>
                  ))}
                  {capsule.memories.length > 3 && (
                    <p className="text-xs text-gray-400">
                      还有 {capsule.memories.length - 3} 个记忆...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
