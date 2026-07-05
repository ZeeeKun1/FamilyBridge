// 安语 - 演示种子数据
// 让冷启动的"待启心意"不为空，路演现场首屏就能看到一封来自家人的家书。
// 仅在 localStorage 标记位未设置时执行一次，避免覆盖用户后续真实数据。

import { saveDriftBottle, getDriftBottlesByReceiver } from "./db";
import { DEMO_MEMBERS, DEMO_FAMILY_ID } from "./auth";
import type { DriftBottle } from "./types";

const SEED_KEY = "anyu_seeded_v1";

function seededFlag(memberId: string): string {
  return `${SEED_KEY}:${memberId}`;
}

export async function seedDemoDataIfNeeded(currentMemberId: string) {
  if (typeof window === "undefined") return;
  const flagKey = seededFlag(currentMemberId);
  if (localStorage.getItem(flagKey)) return;

  const partner = DEMO_MEMBERS.find(
    (m) => m.familyId === DEMO_FAMILY_ID && m.id !== currentMemberId
  );
  if (!partner) {
    localStorage.setItem(flagKey, "1");
    return;
  }

  // 已有任何收件，则视作非冷启动，不再种子
  const existing = await getDriftBottlesByReceiver(currentMemberId);
  if (existing.length > 0) {
    localStorage.setItem(flagKey, "1");
    return;
  }

  const now = Date.now();
  const role = DEMO_MEMBERS.find((m) => m.id === currentMemberId)?.role;

  // 父母端 vs 孩子端 给不同的开场家书，让评委感受到"双向"
  const demoBottle: Omit<DriftBottle, "id"> =
    role === "parent"
      ? {
          senderId: partner.id,
          receiverId: currentMemberId,
          imageryId: "2",
          imageryName: "一杯热茶",
          customMessage: "妈，最近别太累。",
          poem: "茶香袅袅，是我没说出口的关心。\n愿你饮下这一杯，慢一点，也暖一点。",
          status: "sent",
          sentAt: now - 1000 * 60 * 60 * 6, // 6 小时前
        }
      : {
          senderId: partner.id,
          receiverId: currentMemberId,
          imageryId: "1",
          imageryName: "一盏暖灯",
          customMessage: undefined,
          poem: "你回家的路上，妈妈给你点了一盏灯。\n不催，不问，只是亮着。",
          status: "sent",
          sentAt: now - 1000 * 60 * 60 * 3, // 3 小时前
        };

  await saveDriftBottle({
    ...demoBottle,
    id: `seed_${currentMemberId}_${now}`,
  } as DriftBottle);

  localStorage.setItem(flagKey, "1");
}
