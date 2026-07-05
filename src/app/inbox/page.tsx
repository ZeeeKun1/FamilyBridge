"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Icon, { IconNames } from "@/components/shared/Icon";
import type { DriftBottle } from "@/lib/types";

// ---------- 启读详情抽屉（P2: 回一句 + P5: 心动回执 + P6: AI 润色对比） ----------

function BottleDetailDrawer({
  bottle,
  senderName,
  onClose,
  onReply,
  onHeart,
  isReacting,
}: {
  bottle: DriftBottle;
  senderName: string;
  onClose: () => void;
  onReply: (bottle: DriftBottle) => void;
  onHeart: (bottle: DriftBottle) => void;
  isReacting: boolean;
}) {
  const isPolished = bottle.mode === "polish" && bottle.originalText;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fadeIn">
      {/* 半透明遮罩 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 抽屉面板 */}
      <div className="relative bg-gradient-to-b from-mibai to-white rounded-t-[2rem] px-5 pt-6 pb-8 shadow-2xl animate-slideUp max-h-[85%] overflow-y-auto">
        {/* 把手 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* 意象区 */}
        <div className="text-center mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-oupink/25 to-tianqing/20 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Icon name={IconNames.LETTER} size={36} className="text-tianqing" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            {bottle.imageryName || "一封心意"}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            来自 {senderName} ·{" "}
            {new Date(bottle.sentAt).toLocaleDateString("zh-CN", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* 正文 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 mb-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600 whitespace-pre-wrap text-center leading-8">
            {bottle.poem}
          </p>
          {bottle.customMessage && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center whitespace-pre-wrap">
                {bottle.customMessage}
              </p>
            </div>
          )}
        </div>

        {/* AI 润色前后对比（P6） */}
        {isPolished && (
          <div className="bg-amber-50/50 rounded-2xl p-4 mb-4 border border-amber-100">
            <p className="text-[10px] text-amber-600 tracking-widest mb-2 flex items-center gap-1">
              <Icon name={IconNames.SPARKLE} size={12} />
              AI 润色对比
            </p>
            <div className="space-y-2">
              <div className="bg-white/60 rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 mb-0.5">你想说的</p>
                <p className="text-xs text-gray-500 line-through">
                  {bottle.originalText}
                </p>
              </div>
              <div className="flex justify-center">
                <Icon name={IconNames.WIND} size={14} className="text-amber-400" />
              </div>
              <div className="bg-white/60 rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 mb-0.5">AI 帮你说的</p>
                <p className="text-xs text-gray-700">{bottle.poem}</p>
              </div>
            </div>
          </div>
        )}

        {/* 操作区 */}
        <div className="flex gap-3 mb-1">
          {/* 心动（P5） */}
          <button
            type="button"
            onClick={() => onHeart(bottle)}
            disabled={isReacting || !!bottle.reaction}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all active:scale-95 ${
              bottle.reaction
                ? "bg-rose-50 text-rose-400 border border-rose-200"
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            <Icon
              name={IconNames.STAR}
              size={14}
              className={bottle.reaction ? "text-rose-400" : "text-gray-400"}
            />
            {bottle.reaction ? "已心动" : "心动"}
          </button>

          {/* 回一句（P2：往返闭环核心） */}
          <button
            type="button"
            onClick={() => onReply(bottle)}
            className="flex-1 bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-2.5 text-sm font-medium active:scale-[0.98] transition-transform shadow-md flex items-center justify-center gap-2"
          >
            <Icon name={IconNames.LETTER} size={16} className="text-white" />
            回一句
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 主页面 ----------

export default function InboxPage() {
  const router = useRouter();
  const {
    driftBottles,
    loadDriftBottles,
    openDriftBottle,
    reactToDriftBottle,
    timeCapsules,
    loadTimeCapsules,
    currentMember,
    partnerMember,
  } = useStore();

  const [detailBottle, setDetailBottle] = useState<DriftBottle | null>(null);
  const [isReacting, setIsReacting] = useState(false);

  useEffect(() => {
    loadDriftBottles();
    loadTimeCapsules();
  }, [loadDriftBottles, loadTimeCapsules]);

  const me = currentMember?.id;

  const unread = useMemo(
    () => driftBottles.filter((b) => b.status === "sent" && b.receiverId === me),
    [driftBottles, me],
  );
  const opened = useMemo(
    () => driftBottles.filter((b) => b.status === "opened" && b.receiverId === me),
    [driftBottles, me],
  );
  const sent = useMemo(
    () => driftBottles.filter((b) => b.senderId === me),
    [driftBottles, me],
  );
  const dueCapsules = useMemo(
    () => timeCapsules.filter((c) => c.status === "sealed" && c.openAt <= Date.now()),
    [timeCapsules],
  );

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
    });

  // 打开详情抽屉（先启读再展示）
  const handleOpenBottle = async (bottle: DriftBottle) => {
    if (bottle.status === "sent") {
      await openDriftBottle(bottle.id);
    }
    // 重新从 store 拿最新状态
    const updated = useStore.getState().driftBottles.find((b) => b.id === bottle.id);
    setDetailBottle(updated || bottle);
  };

  // 回一句（P2）
  const handleReply = (bottle: DriftBottle) => {
    setDetailBottle(null);
    // 跳转到 bottle 页，通过 URL 参数传入接收人
    router.push(`/bottle?replyTo=${bottle.senderId}&imageryName=${encodeURIComponent(bottle.imageryName || "")}`);
  };

  // 心动（P5）
  const handleHeart = async (bottle: DriftBottle) => {
    setIsReacting(true);
    await reactToDriftBottle(bottle.id, "heart");
    const updated = useStore.getState().driftBottles.find((b) => b.id === bottle.id);
    setDetailBottle(updated || null);
    setIsReacting(false);
  };

  return (
    <div className="bg-gradient-to-b from-mibai via-yuebai to-oupink/10">
      <header className="px-5 pt-8 pb-4 text-center">
        <p className="text-[11px] text-gray-400 tracking-[0.35em]">家书记录</p>
        <h1 className="text-2xl font-light text-gray-700 tracking-wider mt-2">
          家书
        </h1>
        <p className="text-xs text-gray-400 mt-2 tracking-widest">
          慢一点收，暖一点读
        </p>
      </header>

      <div className="px-5 space-y-5">
        {/* 统计条 */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/60 text-center">
            <p className="text-xl font-light text-tianqing">{unread.length}</p>
            <p className="text-[10px] text-gray-400 mt-1">待启</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/60 text-center">
            <p className="text-xl font-light text-oupink">{dueCapsules.length}</p>
            <p className="text-[10px] text-gray-400 mt-1">到期</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/60 text-center">
            <p className="text-xl font-light text-gray-500">{opened.length}</p>
            <p className="text-[10px] text-gray-400 mt-1">已读</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/60 text-center">
            <p className="text-xl font-light text-gray-500">{sent.length}</p>
            <p className="text-[10px] text-gray-400 mt-1">我寄出</p>
          </div>
        </div>

        {/* 待阅的家书 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Icon name={IconNames.RECEIVE} size={16} />
              待阅的家书
            </h2>
            <span className="text-[11px] text-gray-400">{unread.length} 封</span>
          </div>

          {unread.length > 0 ? (
            <div className="space-y-3">
              {unread.map((bottle) => (
                <button
                  key={bottle.id}
                  onClick={() => handleOpenBottle(bottle)}
                  className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 border border-white/70 shadow-soft active:scale-[0.99] transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-oupink/25 to-tianqing/20 flex items-center justify-center shrink-0">
                    <Icon name={IconNames.LETTER} size={22} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-700">
                      来自家人的{bottle.imageryName || "心意"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(bottle.sentAt)} · 轻点轻轻打开
                    </p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white/60 px-4 py-8 text-center text-sm text-gray-400 border border-white/50">
              暂时还没有新的心意
            </div>
          )}
        </section>

        {/* 到期胶囊 */}
        {dueCapsules.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Icon name={IconNames.CAPSULE} size={16} />
                到期胶囊
              </h2>
              <button
                type="button"
                onClick={() => router.push("/capsule")}
                className="text-[11px] text-tianqing"
              >
                去查看
              </button>
            </div>
            <div className="space-y-3">
              {dueCapsules.map((c) => (
                <button
                  key={c.id}
                  onClick={() => router.push("/capsule")}
                  className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 border border-white/70 shadow-soft active:scale-[0.99] transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
                    <Icon name={IconNames.CAPSULE} size={22} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                      {c.content || "一封写给未来的话"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      封存于 {formatDate(c.createdAt)} · 现已可启
                    </p>
                  </div>
                  <Icon
                    name={IconNames.UNLOCK}
                    size={18}
                    className="text-amber-500"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 已阅的家书 */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Icon name={IconNames.MEMORY} size={16} />
              已阅的家书
            </h2>
            <span className="text-[11px] text-gray-400">{opened.length} 封</span>
          </div>

          {opened.length > 0 ? (
            <div className="space-y-2">
              {opened.slice(0, 5).map((bottle) => (
                <button
                  key={bottle.id}
                  onClick={() => setDetailBottle(bottle)}
                  className="w-full bg-white/55 rounded-2xl p-3 flex items-center gap-3 border border-white/50 active:scale-[0.99] transition-transform"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-tianqing/15 to-oupink/15 flex items-center justify-center shrink-0">
                    <Icon
                      name={IconNames.CHECK}
                      size={16}
                      className="text-tianqing"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs text-gray-600">
                      {bottle.imageryName || "心意"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {bottle.openedAt
                        ? formatDate(bottle.openedAt)
                        : formatDate(bottle.sentAt)}{" "}
                      启
                    </p>
                  </div>
                  {bottle.reaction && (
                    <Icon
                      name={IconNames.STAR}
                      size={14}
                      className="text-rose-400"
                    />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white/40 px-4 py-6 text-center text-xs text-gray-400 border border-white/40">
              读过的心意，会静静珍藏在这里
            </div>
          )}
        </section>

        {/* 我写下的家书 */}
        {sent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Icon name={IconNames.LETTER} size={16} />
                我写下的家书
              </h2>
              <span className="text-[11px] text-gray-400">{sent.length} 封</span>
            </div>
            <div className="space-y-2">
              {sent.slice(0, 5).map((bottle) => (
                <button
                  key={bottle.id}
                  onClick={() => setDetailBottle(bottle)}
                  className="w-full bg-white/55 rounded-2xl p-3 flex items-center gap-3 border border-white/50 active:scale-[0.99] transition-transform"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-oupink/20 to-tianqing/15 flex items-center justify-center shrink-0">
                    <Icon
                      name={IconNames.LETTER}
                      size={16}
                      className="text-oupink"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs text-gray-600">
                      {bottle.imageryName || "心意"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDate(bottle.sentAt)} 寄出 ·{" "}
                      {bottle.status === "opened"
                        ? "已被启"
                        : "等待启读"}
                      {bottle.reaction && " · 心动"}
                    </p>
                  </div>
                  {bottle.status === "opened" && !bottle.reaction && (
                    <Icon
                      name={IconNames.CHECK}
                      size={14}
                      className="text-tianqing"
                    />
                  )}
                  {bottle.reaction && (
                    <Icon
                      name={IconNames.STAR}
                      size={14}
                      className="text-rose-400"
                    />
                  )}
                  {bottle.status !== "opened" && !bottle.reaction && (
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 入口提示 */}
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/bottle")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-white/60 shadow-soft text-xs text-gray-600 active:scale-95 transition-transform"
          >
            <Icon name={IconNames.LETTER} size={14} />
            想到一句话，去写一条
          </button>
        </div>
      </div>

      {/* 启读详情抽屉 */}
      {detailBottle && (
        <BottleDetailDrawer
          bottle={detailBottle}
          senderName={
            detailBottle.senderId === currentMember?.id
              ? currentMember?.displayName || "我"
              : partnerMember?.displayName || "家人"
          }
          onClose={() => setDetailBottle(null)}
          onReply={handleReply}
          onHeart={handleHeart}
          isReacting={isReacting}
        />
      )}
    </div>
  );
}