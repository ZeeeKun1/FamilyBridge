"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { useStore } from "@/lib/store";
import { ConversationType } from "@/lib/types";

export default function RecordsPage() {
  const router = useRouter();
  const {
    recentConversations,
    polishRecords,
    loadRecentConversations,
    loadConversation,
    loadPolishRecords,
  } = useStore();

  useEffect(() => {
    loadRecentConversations();
    loadPolishRecords();
  }, [loadRecentConversations, loadPolishRecords]);

  const typeLabel = (type: ConversationType) => {
    switch (type) {
      case "treehole":
        return "🌲 树洞";
      case "practice":
        return "⚔️ 练手";
      case "polish":
        return "✨ 润色";
      default:
        return type;
    }
  };

  const getTargetPath = (type: ConversationType) => {
    switch (type) {
      case "treehole":
        return "/treehole";
      // practice 和 polish 无对应独立路由，统一回到首页
      case "practice":
      case "polish":
      default:
        return "/";
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h1 className="text-lg font-bold font-song mb-4">历史记录</h1>

        {recentConversations.length === 0 && polishRecords.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            还没有记录，开始使用吧
          </p>
        )}

        {recentConversations.map((conv) => {
          const targetPath = getTargetPath(conv.type);
          const parentLabel =
            conv.parentId === "mom"
              ? "妈妈"
              : conv.parentId === "dad"
              ? "爸爸"
              : "";
          return (
            <div
              key={conv.id}
              onClick={async () => {
                await loadConversation(conv.id);
                router.push(targetPath);
              }}
              className="bg-gray-50 rounded-lg p-3 mb-2 text-xs cursor-pointer active:bg-gray-100"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">
                  {typeLabel(conv.type)}
                  {parentLabel ? ` · ${parentLabel}` : ""}
                </span>
                <span className="text-gray-400">
                  {new Date(conv.createdAt).toLocaleString("zh-CN")}
                </span>
              </div>
              <p className="text-gray-500 truncate">
                {conv.messages[0]?.content?.slice(0, 60) || "空对话"}
              </p>
            </div>
          );
        })}

        {polishRecords.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2">改写记录</h3>
            {polishRecords.map((r) => (
              <div
                key={r.id}
                className="bg-green-50 rounded-lg p-3 mb-2 text-xs"
              >
                <div className="text-gray-400 mb-0.5">原话</div>
                <p className="text-gray-600 mb-1 truncate">{r.originalText}</p>
                <div className="text-gray-400 mb-0.5">→ 温柔版</div>
                <p className="text-green-800 truncate">{r.polishedText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
