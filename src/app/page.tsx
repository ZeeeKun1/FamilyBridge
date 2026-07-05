"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Icon, { IconNames } from "@/components/shared/Icon";
import { groupEntriesByTime } from "@/lib/timeline";
import type { TimelineEntry, TimelineGroup } from "@/lib/types";

// ============================================================
// 家庭时间轴 — 首页
// 每一封家书都是家庭历史的一页，不再消失于聊天记录
// ============================================================

// ---------- 日期头部 ----------
function TimelineHeader({
  stats,
  isParent,
}: {
  stats: { totalMessages: number; heartCount: number };
  isParent: boolean;
}) {
  const today = new Date().toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className="px-5 pt-8 pb-4">
      <p className="text-[11px] text-gray-400 tracking-[0.35em]">{today}</p>
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-light text-gray-700 tracking-wider">
            家庭时光
          </h1>
          <p className="text-xs text-gray-400 mt-1 tracking-widest">
            每一笔，都是历史
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className={isParent ? "text-lg" : "text-base"}>{stats.totalMessages}</p>
            <p className="text-[10px] text-gray-400">封家书</p>
          </div>
          {stats.heartCount > 0 && (
            <div className="text-center">
              <p className={`${isParent ? "text-lg" : "text-base"} text-rose-400`}>
                {stats.heartCount}
              </p>
              <p className="text-[10px] text-gray-400">心动</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ---------- 时间分组头 ----------
function TimeGroupHeader({
  group,
  count,
}: {
  group: TimelineGroup;
  count: number;
}) {
  const labels: Record<TimelineGroup, string> = {
    today: "今天",
    thisWeek: "本周",
    thisMonth: "本月",
    earlier: "更早",
  };

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 px-5 py-2">
      <span className="text-sm font-medium text-gray-700">{labels[group]}</span>
      <span className="text-[11px] text-gray-400">{count} 封</span>
      <div className="flex-1 h-px bg-gradient-to-r from-tianqing/15 to-transparent" />
    </div>
  );
}

// ---------- 单条记忆卡片 ----------
function TimelineEntryCard({
  entry,
  isParent,
  onOpen,
}: {
  entry: TimelineEntry;
  isParent: boolean;
  onOpen: (id: string) => void;
}) {
  const { bottle, direction, senderName, isSpecial, specialLabel, seasonTag, isUnread } = entry;
  const iconSize = isParent ? 24 : 20;
  const cardSize = isParent ? "p-5" : "p-4";

  // 意象图标映射
  const imageryIcons: Record<string, string> = {
    lamp: IconNames.LAMP,
    tea: IconNames.TEA,
    letter: IconNames.LETTER,
    spring: IconNames.SPRING,
    hug: IconNames.HUG,
    star: IconNames.STAR,
    leaf: IconNames.LEAF,
    wind: IconNames.WIND,
  };
  const iconName = imageryIcons[bottle.imageryId] || IconNames.LETTER;

  return (
    <div className="relative pl-12 pr-5 py-1.5">
      {/* 时间轴竖线 */}
      <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-tianqing/5 via-tianqing/20 to-tianqing/5" />

      {/* 时间点 */}
      <div
        className={`absolute left-[19px] top-5 rounded-full border-2 border-white transition-all ${
          isUnread
            ? "w-2.5 h-2.5 bg-oupink animate-pulse shadow-[0_0_0_3px_rgba(230,213,213,0.2)]"
            : isSpecial
              ? "w-3 h-3 left-[17px] bg-tianqing shadow-[0_0_0_4px_rgba(163,184,198,0.15),0_0_10px_rgba(163,184,198,0.2)]"
              : "w-2 h-2 bg-tianqing/60"
        }`}
      />

      {/* 卡片 */}
      <button
        onClick={() => onOpen(bottle.id)}
        className={`w-full bg-white/80 backdrop-blur-sm rounded-3xl ${cardSize} border border-white/70 shadow-soft active:scale-[0.98] transition-transform text-left ${
          isUnread ? "border-l-2 border-l-oupink" : ""
        }`}
      >
        {/* 意象图标 + 头部行 */}
        <div className="flex items-start gap-3">
          <div
            className={`rounded-2xl bg-gradient-to-br from-oupink/15 to-tianqing/15 flex items-center justify-center shrink-0 shadow-sm ${
              isParent ? "w-14 h-14" : "w-12 h-12"
            }`}
          >
            <Icon
              name={iconName}
              size={iconSize}
              className="text-tianqing"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* 发送者 + 特殊标记 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500">
                {direction === "received" ? `来自 ${senderName}` : `写给 ${entry.receiverName}`}
              </span>
              {isSpecial && specialLabel && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  {specialLabel}
                </span>
              )}
              {seasonTag && !isSpecial && (
                <span className="text-[10px] text-gray-400">{seasonTag}</span>
              )}
            </div>

            {/* 诗句 */}
            <p
              className={`text-gray-600 mt-1 leading-relaxed line-clamp-2 ${
                isParent ? "text-base" : "text-sm"
              }`}
            >
              {bottle.poem}
            </p>

            {/* 底部信息 */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] text-gray-400">{entry.dateLabel}</span>
              {bottle.reaction && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400">
                  <Icon name={IconNames.CARE} size={12} />
                  心动
                </span>
              )}
              {bottle.status === "opened" && direction === "sent" && (
                <span className="flex items-center gap-1 text-[11px] text-tianqing">
                  <Icon name={IconNames.CHECK} size={12} />
                  已启
                </span>
              )}
              {isUnread && (
                <span className="text-[11px] text-oupink font-medium">待启</span>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

// ---------- 时间轴视图 ----------
function TimelineView({
  entries,
  isParent,
  onOpen,
}: {
  entries: TimelineEntry[];
  isParent: boolean;
  onOpen: (id: string) => void;
}) {
  const groups = useMemo(() => groupEntriesByTime(entries), [entries]);
  const groupOrder: TimelineGroup[] = ["today", "thisWeek", "thisMonth", "earlier"];

  return (
    <div className="pb-4">
      {groupOrder.map((group) => {
        const groupEntries = groups[group];
        if (groupEntries.length === 0) return null;

        return (
          <div key={group}>
            <TimeGroupHeader group={group} count={groupEntries.length} />
            {groupEntries.map((entry) => (
              <TimelineEntryCard
                key={entry.bottle.id}
                entry={entry}
                isParent={isParent}
                onOpen={onOpen}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ---------- 空状态 + 欢迎引导 ----------
const ONBOARD_STEPS = [
  { icon: IconNames.LETTER, title: "写一条", desc: "选一个意象或心情，让 AI 帮你变成诗" },
  { icon: IconNames.RECEIVE, title: "收到家书", desc: "家人在收件箱里看到你的心意" },
  { icon: IconNames.CARE, title: "心动回执", desc: "对方点一颗心，你就知道 TA 收到了" },
];

function TimelineEmptyState({
  onWriteFirst,
  isParent,
}: {
  onWriteFirst: () => void;
  isParent: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-5">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-tianqing/10 to-oupink/10 flex items-center justify-center mb-6 animate-float">
        <Icon name={IconNames.LETTER} size={40} className="text-tianqing/40" />
      </div>
      <p className="text-base text-gray-500 mb-2">
        {isParent ? "家书的第一页，等孩子来写" : "家书的第一页，等你来写"}
      </p>
      <p className="text-xs text-gray-400 mb-6 text-center">
        每一封信，都会成为家庭时光里的一页
        <br />
        而不是消失在聊天记录里
      </p>

      {/* 欢迎引导三步 */}
      {!isParent && (
        <div className="w-full space-y-2.5 mb-8">
          {ONBOARD_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/60">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-tianqing/15 to-oupink/10 flex items-center justify-center shrink-0">
                <Icon name={step.icon} size={16} className="text-tianqing" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{step.title}</p>
                <p className="text-[11px] text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onWriteFirst}
        className="px-8 py-3 bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl text-sm font-medium active:scale-95 transition-transform shadow-md"
      >
        {isParent ? "等待孩子来信" : "写第一封家书"}
      </button>
    </div>
  );
}

// ---------- 快捷操作 ----------
function TimelineQuickActions({
  isParent,
  router,
}: {
  isParent: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  if (isParent) {
    // 父母端：单一浮动写按钮
    return (
      <div className="px-5 mt-2 mb-2 flex justify-end">
        <button
          onClick={() => router.push("/bottle")}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-oupink to-rose-300 text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
        >
          <Icon name={IconNames.LETTER} size={24} className="text-white" />
        </button>
      </div>
    );
  }

  // 孩子端：折叠"更多"
  return (
    <div className="px-5 mt-2 mb-2">
      <details className="group">
        <summary className="text-xs text-gray-400 cursor-pointer list-none flex items-center gap-1 select-none">
          <Icon name={IconNames.ALL} size={14} />
          更多
          <span className="text-[10px] text-gray-300 ml-1">探索其他功能</span>
        </summary>
        <div className="grid grid-cols-4 gap-2 mt-3">
          <MiniEntry label="时光胶囊" icon={IconNames.CAPSULE} onClick={() => router.push("/capsule")} />
          <MiniEntry label="思绪森林" icon={IconNames.TREEHOLE} onClick={() => router.push("/treehole")} />
          <MiniEntry label="贴心翻译" icon={IconNames.WIND} onClick={() => router.push("/translate")} />
          <MiniEntry label="情绪气象" icon={IconNames.WEATHER} onClick={() => router.push("/weather")} />
        </div>
      </details>
    </div>
  );
}

function MiniEntry({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/60 flex flex-col items-center gap-2 active:scale-95 transition-transform"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yuebai to-mibai flex items-center justify-center">
        <Icon name={icon} size={18} className="text-gray-500" />
      </div>
      <span className="text-[11px] text-gray-500">{label}</span>
    </button>
  );
}

// ============================================================
// 父母端独立首页 — 双大卡
// 评审 #0002 P3：父母端不是"小号孩子端"，而是专属交互
// ============================================================

const PARENT_GREETINGS = [
  { text: "路上小心", icon: IconNames.WIND },
  { text: "吃饭了吗", icon: IconNames.LEAF },
  { text: "今天加油", icon: IconNames.SPARKLE },
  { text: "早点休息", icon: IconNames.CALM },
  { text: "天冷加衣", icon: IconNames.HUG },
  { text: "想你了", icon: IconNames.CARE },
];

function ParentHomePage({ router }: { router: ReturnType<typeof useRouter> }) {
  const {
    driftBottles,
    loadDriftBottles,
    openDriftBottle,
    sendDriftBottle,
    getTimelineStats,
  } = useStore();

  useEffect(() => {
    loadDriftBottles();
  }, [loadDriftBottles]);

  const stats = useMemo(() => getTimelineStats(), [driftBottles, getTimelineStats]);

  // 取最新一封来自孩子的未读家书
  const latestUnread = useMemo(
    () =>
      [...driftBottles]
        .filter((b) => b.receiverId === useStore.getState().currentMember?.id && b.status === "sent")
        .sort((a, b) => b.sentAt - a.sentAt)[0],
    [driftBottles]
  );

  const handleSeeBottle = async () => {
    if (!latestUnread) return;
    await openDriftBottle(latestUnread.id);
    router.push("/inbox");
  };

  const handleQuickGreeting = async (text: string) => {
    const me = useStore.getState().currentMember;
    const partner = useStore.getState().partnerMember;
    if (!me || !partner) return;
    await sendDriftBottle({
      senderId: me.id,
      receiverId: partner.id,
      imageryId: "greeting",
      imageryName: "一键问候",
      customMessage: text,
      poem: text,
      mode: "greeting",
      status: "sent",
      sentAt: Date.now(),
    });
  };

  return (
    <div className="bg-gradient-to-b from-oupink/5 via-mibai to-yuebai">
      {/* 头部 */}
      <header className="px-6 pt-8 pb-5">
        <p className="text-[11px] text-gray-400 tracking-[0.35em]">
          {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
        </p>
        <h1 className="text-2xl font-light text-gray-700 tracking-wider mt-2">
          你好，{useStore.getState().currentMember?.displayName || "妈妈"}
        </h1>
        <p className="text-xs text-gray-400 mt-1 tracking-widest">
          孩子给家里写了 {stats.receivedCount} 封信
        </p>
      </header>

      {/* 大卡1：看到孩子今天 */}
      <div className="px-5 mb-4">
        <div className="bg-gradient-to-br from-tianqing/15 to-oupink/10 rounded-3xl p-6 border border-white/70 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-tianqing/15 flex items-center justify-center">
              <Icon name={IconNames.RECEIVE} size={18} className="text-tianqing" />
            </div>
            <h2 className="text-base font-medium text-gray-700">看到孩子今天</h2>
          </div>

          {latestUnread ? (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/70">
                <p className="text-[11px] text-gray-400 mb-2">
                  {new Date(latestUnread.sentAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })} ·
                  {new Date(latestUnread.sentAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="text-base text-gray-600 leading-relaxed font-song">
                  {latestUnread.poem}
                </p>
                {latestUnread.imageryName !== "一键问候" && (
                  <p className="text-xs text-tianqing mt-2">意象：{latestUnread.imageryName}</p>
                )}
              </div>
              <button
                onClick={handleSeeBottle}
                className="w-full bg-gradient-to-r from-tianqing to-tianqing/80 text-white rounded-2xl py-3.5 text-base font-medium active:scale-[0.98] transition-transform shadow-md"
              >
                我看到了
              </button>
            </>
          ) : (
            <div className="bg-white/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-yuebai flex items-center justify-center mx-auto mb-3">
                <Icon name={IconNames.HOME} size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">暂时没有新家书</p>
              <p className="text-xs text-gray-300 mt-1">孩子写信时会在这里提醒你</p>
            </div>
          )}
        </div>
      </div>

      {/* 大卡2：我也说一句 */}
      <div className="px-5 mb-4">
        <div className="bg-gradient-to-br from-oupink/15 to-rose-50/80 rounded-3xl p-6 border border-white/70 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-oupink/15 flex items-center justify-center">
              <Icon name={IconNames.LETTER} size={18} className="text-oupink" />
            </div>
            <h2 className="text-base font-medium text-gray-700">我也说一句</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">点一下就能发给孩子，不用打字</p>
          <div className="grid grid-cols-2 gap-3">
            {PARENT_GREETINGS.map((g) => (
              <button
                key={g.text}
                onClick={() => handleQuickGreeting(g.text)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/70 active:scale-[0.97] transition-transform shadow-sm text-left hover:shadow-medium"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yuebai to-mibai flex items-center justify-center">
                  <Icon name={g.icon} size={20} className="text-gray-500" />
                </div>
                <p className="text-base text-gray-700 mt-2 font-medium">{g.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/60">
            <p className="text-lg font-bold text-tianqing">{stats.totalMessages}</p>
            <p className="text-[11px] text-gray-400 mt-1">家书总数</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/60">
            <p className="text-lg font-bold text-oupink">{stats.sentCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">我写的</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/60">
            <p className="text-lg font-bold text-rose-400">{stats.heartCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">心动</p>
          </div>
        </div>
      </div>

      {/* 底部快捷入口 */}
      <div className="px-5 mb-2">
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/inbox")}
            className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <Icon name={IconNames.RECEIVE} size={20} className="text-tianqing" />
            <span className="text-sm text-gray-600">全部家书</span>
          </button>
          <button
            onClick={() => router.push("/bottle")}
            className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <Icon name={IconNames.LETTER} size={20} className="text-oupink" />
            <span className="text-sm text-gray-600">写一封长的</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 主页面
// ============================================================
export default function HomePage() {
  const router = useRouter();
  const {
    userType,
    driftBottles,
    loadDriftBottles,
    openDriftBottle,
    getTimelineEntries,
    getTimelineStats,
  } = useStore();

  const isParent = userType === "parent";

  useEffect(() => {
    loadDriftBottles();
  }, [loadDriftBottles]);

  // 从现有 driftBottles 派生时间轴数据
  const entries = useMemo(
    () => getTimelineEntries(),
    [driftBottles, getTimelineEntries]
  );

  const stats = useMemo(
    () => getTimelineStats(),
    [driftBottles, getTimelineStats]
  );

  const handleOpen = async (id: string) => {
    await openDriftBottle(id);
    router.push("/inbox");
  };

  const handleWriteFirst = () => {
    router.push("/bottle");
  };

  // 父母端走独立双大卡首页
  if (isParent) {
    return <ParentHomePage router={router} />;
  }

  return (
    <div className="bg-gradient-to-b from-mibai via-yuebai to-oupink/10">
      <TimelineHeader stats={stats} isParent={isParent} />

      {/* 今日家庭气象卡片 — P4 留存抓手（被动触发） */}
      <div className="px-5 mb-3">
        <div className="bg-gradient-to-r from-tianqing/10 to-oupink/10 rounded-2xl px-4 py-3 border border-tianqing/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-tianqing/15 to-oupink/10 flex items-center justify-center shrink-0">
            <Icon
              name={stats.unreadCount > 0 ? IconNames.RECEIVE : stats.heartCount > 0 ? IconNames.CARE : IconNames.WEATHER}
              size={18}
              className="text-tianqing"
            />
          </div>
          <p className="text-xs text-gray-500 flex-1">
            {stats.unreadCount > 0
              ? `你有 ${stats.unreadCount} 封未读家书，快去看看吧`
              : stats.totalMessages > 0
                ? `已累计 ${stats.totalMessages} 封家书${stats.heartCount > 0 ? `，${stats.heartCount} 次心动` : ""}，继续传递温暖`
                : "开始写下第一封家书，让爱流动起来"}
          </p>
          {stats.unreadCount > 0 && (
            <button onClick={() => router.push("/inbox")} className="text-[11px] text-tianqing font-medium shrink-0 active:opacity-70">
              去看 →
            </button>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <TimelineEmptyState onWriteFirst={handleWriteFirst} isParent={isParent} />
      ) : (
        <>
          <TimelineView entries={entries} isParent={isParent} onOpen={handleOpen} />
          <TimelineQuickActions isParent={isParent} router={router} />
        </>
      )}
    </div>
  );
}