// 安语 - 账号与会话（mock）
// 预设两组测试账号 + 一个 demo 家庭，登录时区分父母/孩子身份。
// 真实落地阶段应替换为后端鉴权 + 邀请绑定流程；当前用 localStorage 模拟。

import type { AuthAccount, FamilyMember, Session } from "./types";

export const DEMO_FAMILY_ID = "family_demo_01";

// 预置家庭成员（孩子 + 妈妈）
export const DEMO_MEMBERS: FamilyMember[] = [
  {
    id: "member_child_01",
    familyId: DEMO_FAMILY_ID,
    role: "child",
    displayName: "小语",
    relation: "孩子",
    avatarTone: "tianqing",
  },
  {
    id: "member_mom_01",
    familyId: DEMO_FAMILY_ID,
    role: "parent",
    displayName: "妈妈",
    relation: "妈妈",
    avatarTone: "oupink",
  },
];

// 两组测试账号
export const DEMO_ACCOUNTS: AuthAccount[] = [
  { username: "child", password: "1234", memberId: "member_child_01" },
  { username: "parent", password: "1234", memberId: "member_mom_01" },
];

const SESSION_KEY = "anyu_session_v1";

export function findAccount(username: string, password: string): AuthAccount | undefined {
  return DEMO_ACCOUNTS.find((a) => a.username === username && a.password === password);
}

export function getMember(memberId: string): FamilyMember | undefined {
  return DEMO_MEMBERS.find((m) => m.id === memberId);
}

export function getFamilyMembers(familyId: string): FamilyMember[] {
  return DEMO_MEMBERS.filter((m) => m.familyId === familyId);
}

export function getOtherMember(currentMemberId: string): FamilyMember | undefined {
  const me = getMember(currentMemberId);
  if (!me) return undefined;
  return DEMO_MEMBERS.find((m) => m.familyId === me.familyId && m.id !== currentMemberId);
}

export function login(username: string, password: string): Session | null {
  const account = findAccount(username, password);
  if (!account) return null;
  const session: Session = { memberId: account.memberId, loggedAt: Date.now() };
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}
