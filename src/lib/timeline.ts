// ============================================================
// 家庭时间轴 — 纯计算层
// 从 DriftBottle[] 派生 TimelineEntry[]，不持久化，不修改 DB
// ============================================================

import type { DriftBottle, TimelineGroup, TimelineEntry, TimelineStats } from "./types";
import type { FamilyMember } from "./types";

// ---------- 时间分组 ----------
const MS_PER_DAY = 86400000;

export function groupByTime(sentAt: number): TimelineGroup {
  const now = Date.now();
  const diff = now - sentAt;

  if (diff < MS_PER_DAY) return "today";
  if (diff < 7 * MS_PER_DAY) return "thisWeek";
  if (diff < 30 * MS_PER_DAY) return "thisMonth";
  return "earlier";
}

// ---------- 日期格式化 ----------
const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function formatDateLabel(timestamp: number): string {
  const d = new Date(timestamp);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = WEEKDAY_NAMES[d.getDay()];
  return `${month}月${day}日 ${weekday}`;
}

export function formatTimeLabel(timestamp: number): string {
  const d = new Date(timestamp);
  const hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, "0");
  if (hour < 6) return `凌晨${hour}:${minute}`;
  if (hour < 12) return `上午${hour}:${minute}`;
  if (hour < 13) return `中午${hour}:${minute}`;
  if (hour < 18) return `下午${hour - 12}:${minute}`;
  return `晚上${hour - 12}:${minute}`;
}

// ---------- 节气检测 ----------
interface SeasonTerm {
  name: string;
  emoji: string;
  month: number;
  day: number;
}

const SOLAR_TERMS: SeasonTerm[] = [
  { name: "小寒", emoji: "❄️", month: 1, day: 5 },
  { name: "大寒", emoji: "🥶", month: 1, day: 20 },
  { name: "立春", emoji: "🌱", month: 2, day: 4 },
  { name: "雨水", emoji: "🌧️", month: 2, day: 19 },
  { name: "惊蛰", emoji: "⚡", month: 3, day: 5 },
  { name: "春分", emoji: "🌸", month: 3, day: 20 },
  { name: "清明", emoji: "🍃", month: 4, day: 5 },
  { name: "谷雨", emoji: "🌾", month: 4, day: 20 },
  { name: "立夏", emoji: "🌿", month: 5, day: 5 },
  { name: "小满", emoji: "🌻", month: 5, day: 21 },
  { name: "芒种", emoji: "🌾", month: 6, day: 6 },
  { name: "夏至", emoji: "☀️", month: 6, day: 21 },
  { name: "小暑", emoji: "🔥", month: 7, day: 7 },
  { name: "大暑", emoji: "🌡️", month: 7, day: 23 },
  { name: "立秋", emoji: "🍂", month: 8, day: 7 },
  { name: "处暑", emoji: "🌤️", month: 8, day: 23 },
  { name: "白露", emoji: "💧", month: 9, day: 8 },
  { name: "秋分", emoji: "🍁", month: 9, day: 23 },
  { name: "寒露", emoji: "🥀", month: 10, day: 8 },
  { name: "霜降", emoji: "❄️", month: 10, day: 23 },
  { name: "立冬", emoji: "🌬️", month: 11, day: 7 },
  { name: "小雪", emoji: "🌨️", month: 11, day: 22 },
  { name: "大雪", emoji: "⛄", month: 12, day: 7 },
  { name: "冬至", emoji: "🧣", month: 12, day: 22 },
];

export function getSeasonTag(date: Date): string | undefined {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 找到最近的前一个节气（3天窗口内）
  for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
    const term = SOLAR_TERMS[i];
    if (term.month === month && Math.abs(term.day - day) <= 3) {
      return `${term.emoji} ${term.name}`;
    }
  }
  return undefined;
}

// ---------- 特殊日期检测 ----------
export function isSpecialDate(
  bottles: DriftBottle[],
  index: number
): { label: string } | undefined {
  const sorted = [...bottles].sort((a, b) => a.sentAt - b.sentAt);

  // 第一封家书
  if (sorted.length > 0 && bottles[index].id === sorted[0].id) {
    return { label: "第一封家书" };
  }

  // 整百封（第100、200...）
  const bottleIndex = sorted.findIndex((b) => b.id === bottles[index].id);
  if (bottleIndex > 0 && bottleIndex % 100 === 0) {
    return { label: `第${bottleIndex}封家书` };
  }

  // 节气当天
  const date = new Date(bottles[index].sentAt);
  const season = getSeasonTag(date);
  if (season) {
    return { label: season };
  }

  return undefined;
}

// ---------- 核心计算：DriftBottle[] → TimelineEntry[] ----------
export function computeTimelineEntries(
  bottles: DriftBottle[],
  currentMemberId: string,
  partnerMember: FamilyMember | null
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const bottle of bottles) {
    const isFromMe = bottle.senderId === currentMemberId;
    const direction: "sent" | "received" = isFromMe ? "sent" : "received";
    const senderName = isFromMe
      ? "我"
      : partnerMember?.displayName || "家人";
    const receiverName = isFromMe
      ? partnerMember?.displayName || "家人"
      : "我";
    const isUnread =
      direction === "received" && bottle.status === "sent";

    const date = new Date(bottle.sentAt);
    const special = isSpecialDate(bottles, bottles.indexOf(bottle));

    entries.push({
      bottle,
      group: groupByTime(bottle.sentAt),
      dateLabel: formatDateLabel(bottle.sentAt),
      timeLabel: formatTimeLabel(bottle.sentAt),
      isSpecial: !!special,
      specialLabel: special?.label,
      seasonTag: getSeasonTag(date),
      direction,
      senderName,
      receiverName,
      isUnread,
    });
  }

  // 按时间倒序排列
  entries.sort((a, b) => b.bottle.sentAt - a.bottle.sentAt);
  return entries;
}

// ---------- 核心计算：TimelineStats ----------
export function computeTimelineStats(bottles: DriftBottle[]): TimelineStats {
  const sorted = [...bottles].sort((a, b) => a.sentAt - b.sentAt);

  const totalMessages = bottles.length;
  const firstMessageDate = sorted.length > 0 ? sorted[0].sentAt : null;
  const daysSinceFirst = firstMessageDate
    ? Math.floor((Date.now() - firstMessageDate) / MS_PER_DAY)
    : 0;
  const sentCount = bottles.filter((b) => b.senderId === b.senderId).length;
  const receivedCount = totalMessages - sentCount;
  const unreadCount = bottles.filter(
    (b) => b.status === "sent"
  ).length;
  const heartCount = bottles.filter((b) => !!b.reaction).length;

  return {
    totalMessages,
    firstMessageDate,
    daysSinceFirst,
    sentCount,
    receivedCount,
    unreadCount,
    heartCount,
  };
}

// ---------- 辅助：按时间分组 ----------
export function groupEntriesByTime(
  entries: TimelineEntry[]
): Record<TimelineGroup, TimelineEntry[]> {
  const groups: Record<TimelineGroup, TimelineEntry[]> = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    earlier: [],
  };

  for (const entry of entries) {
    groups[entry.group].push(entry);
  }

  return groups;
}

// ---------- 导出：节气数据（供外部使用） ----------
export { SOLAR_TERMS };