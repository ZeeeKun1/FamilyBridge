// 安语 - AI 调用兑底文案库
// 路演现场最怕 VIVO_API_KEY 缺失或网络异常导致核心动作哑火。
// 这里按 capability 提供预写的"诗意文案"，调用失败时由 route.ts 回退使用。

import type { AICapability } from "./types";

interface FallbackContext {
  imageryName?: string;
  receiverName?: string;
  raw?: string;
}

const FALLBACK_POEMS: Record<string, string[]> = {
  warmth: [
    "愿这盏灯，照亮你回家的路。",
    "夜里有风，愿你身边有光。",
    "暖一壶茶，等你慢慢回来。",
  ],
  care: [
    "记得吃饭，记得早睡，记得我在想你。",
    "茶要趁热，话要说出口。",
    "别太累，世界很大，慢慢走。",
  ],
  apology: [
    "上次的话，是我说重了。对不起。",
    "那天没说出口的，今天想轻轻补回来。",
    "如果有些话伤了你，请收下这份歉意。",
  ],
  celebration: [
    "为你高兴，像春天的第一缕风。",
    "你做到了，我一直都相信。",
    "愿你欢喜的事，都被人看见。",
  ],
  memory: [
    "想起小时候，你拉着我的手。",
    "有些话写在心里，写不进微信。",
    "时间走得很快，但我们没走散。",
  ],
};

function pickByImagery(imageryName?: string): string {
  if (!imageryName) return FALLBACK_POEMS.warmth[0];
  // 简单关键词映射
  if (/灯|光|夜|星/.test(imageryName)) return random(FALLBACK_POEMS.warmth);
  if (/茶|拥抱|风|春/.test(imageryName)) return random(FALLBACK_POEMS.care);
  if (/家书|落叶|笋/.test(imageryName)) return random(FALLBACK_POEMS.memory);
  return random(FALLBACK_POEMS.warmth);
}

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function fallbackForCapability(
  capability: AICapability,
  ctx: FallbackContext = {}
): string {
  switch (capability) {
    case "drift_bottle":
      return pickByImagery(ctx.imageryName);
    case "time_capsule":
      return "把这句话封进时间，等你打开的时候，依然温柔。";
    case "polish":
      return ctx.raw
        ? ctx.raw.replace(/[!！]/g, "。").replace(/笨蛋|废物/g, "")
        : "我有些话想说，但还没想好怎么说。";
    case "translate":
      return "TA 没说出口的，其实是关心。试着回一句温暖的话吧。";
    case "treehole_listen":
      return "我在听，慢慢说。";
    case "treehole_summary":
      return "今天的情绪：温和起伏，被理解的瞬间最珍贵。";
    case "insight":
      return "也许 TA 想表达的，是另一种关心。";
    case "persona":
    case "simulation":
      return "（演示模式：AI 暂未配置，使用预设回复。）";
    default:
      return "愿你被温柔地理解。";
  }
}
