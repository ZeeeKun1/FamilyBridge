import { create } from "zustand";
import {
  UserProfile,
  ParentProfile,
  Conversation,
  Message,
  PolishRecord,
  DriftBottle,
  TimeCapsule,
  EmotionWeather,
  FamilyMember,
  TimelineEntry,
  TimelineStats,
} from "./types";
import {
  getUserProfile,
  saveParentProfile,
  getAllParentProfiles,
  saveConversation,
  getConversation,
  getRecentConversations,
  getPolishRecords,
  saveDriftBottle,
  getDriftBottlesByReceiver,
  getDriftBottlesBySender,
  updateBottleStatus,
  updateDriftBottle,
  saveTimeCapsule,
  getAllTimeCapsules,
  updateTimeCapsule,
  saveEmotionWeather,
  getRecentEmotionWeathers,
  initDefaultData,
} from "./db";
import { UserType, designConfigs } from "./designConfig";
import {
  getSession,
  getMember,
  getOtherMember,
  login as authLogin,
  logout as authLogout,
} from "./auth";
import { seedDemoDataIfNeeded } from "./seed";
import { computeTimelineEntries, computeTimelineStats } from "./timeline";

interface AppState {
  userProfile: UserProfile | null;
  loadUserProfile: () => Promise<void>;

  // 会话与家庭
  currentMember: FamilyMember | null;
  partnerMember: FamilyMember | null;   // 同家庭的另一位成员（接收人）
  hydrateSession: () => void;            // 启动时从 localStorage 恢复
  login: (username: string, password: string) => boolean;
  logout: () => void;

  userType: UserType;                    // 由 currentMember.role 派生，保留兼容
  setUserType: (type: UserType) => void; // 仅供调试用

  parentProfiles: ParentProfile[];
  loadParentProfiles: () => Promise<void>;
  updateParentProfile: (profile: ParentProfile) => Promise<void>;

  currentConversation: Conversation | null;
  startConversation: (type: Conversation["type"], parentId?: string) => void;
  addMessage: (message: Message) => void;
  endConversation: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;

  recentConversations: Conversation[];
  loadRecentConversations: (type?: Conversation["type"]) => Promise<void>;

  polishRecords: PolishRecord[];
  loadPolishRecords: () => Promise<void>;

  // 漂流瓶
  driftBottles: DriftBottle[];
  loadDriftBottles: () => Promise<void>;
  sendDriftBottle: (bottle: Omit<DriftBottle, "id">) => Promise<void>;
  openDriftBottle: (id: string) => Promise<void>;
  reactToDriftBottle: (id: string, reaction: "heart") => Promise<void>;

  // 家庭时间轴（派生方法，不持久化）
  getTimelineEntries: () => TimelineEntry[];
  getTimelineStats: () => TimelineStats;

  // 时光胶囊
  timeCapsules: TimeCapsule[];
  loadTimeCapsules: () => Promise<void>;
  createTimeCapsule: (capsule: Omit<TimeCapsule, "id">) => Promise<void>;
  openCapsule: (id: string) => Promise<void>;

  // 情绪气象
  emotionWeather: EmotionWeather | null;
  recentWeathers: EmotionWeather[];
  loadEmotionWeathers: () => Promise<void>;
  updateEmotionWeather: (weather: Omit<EmotionWeather, "id">) => Promise<void>;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // 设计配置
  designConfig: typeof designConfigs[UserType];
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useStore = create<AppState>((set, get) => ({
  userProfile: null,
  loadUserProfile: async () => {
    await initDefaultData();
    const profile = await getUserProfile();
    set({ userProfile: profile || null });
    if (profile?.isParent) {
      set({ userType: "parent" });
    }
  },

  // ====== 会话 ======
  currentMember: null,
  partnerMember: null,
  hydrateSession: () => {
    const session = getSession();
    if (!session) return;
    const me = getMember(session.memberId) || null;
    const partner = me ? getOtherMember(me.id) || null : null;
    set({
      currentMember: me,
      partnerMember: partner,
      userType: me?.role === "parent" ? "parent" : "child",
      designConfig: designConfigs[me?.role === "parent" ? "parent" : "child"],
    });
    if (me) {
      // 异步种子，不阻塞 UI
      seedDemoDataIfNeeded(me.id).catch(() => {});
    }
  },
  login: (username, password) => {
    const session = authLogin(username, password);
    if (!session) return false;
    const me = getMember(session.memberId) || null;
    const partner = me ? getOtherMember(me.id) || null : null;
    set({
      currentMember: me,
      partnerMember: partner,
      userType: me?.role === "parent" ? "parent" : "child",
      designConfig: designConfigs[me?.role === "parent" ? "parent" : "child"],
    });
    if (me) {
      seedDemoDataIfNeeded(me.id).catch(() => {});
    }
    return true;
  },
  logout: () => {
    authLogout();
    set({ currentMember: null, partnerMember: null });
  },

  userType: "child",
  setUserType: (type) => {
    set({ userType: type });
    set({ designConfig: designConfigs[type] });
  },

  parentProfiles: [],
  loadParentProfiles: async () => {
    const profiles = await getAllParentProfiles();
    set({ parentProfiles: profiles });
  },
  updateParentProfile: async (profile) => {
    await saveParentProfile(profile);
    const profiles = await getAllParentProfiles();
    set({ parentProfiles: profiles });
  },

  currentConversation: null,
  startConversation: (type, parentId) => {
    set({
      currentConversation: {
        id: generateId(),
        type,
        parentId,
        messages: [],
        createdAt: Date.now(),
      },
    });
  },
  addMessage: (message) => {
    const conv = get().currentConversation;
    if (!conv) return;
    set({
      currentConversation: {
        ...conv,
        messages: [...conv.messages, message],
      },
    });
  },
  endConversation: async () => {
    const conv = get().currentConversation;
    if (!conv) return;
    await saveConversation(conv);
    set({ currentConversation: null });

    const recent = await getRecentConversations();
    set({ recentConversations: recent });
  },
  loadConversation: async (id) => {
    const conv = await getConversation(id);
    if (conv) {
      set({ currentConversation: conv });
    }
  },

  recentConversations: [],
  loadRecentConversations: async (type) => {
    const recent = type
      ? (await getRecentConversations()).filter((c) => c.type === type)
      : await getRecentConversations();
    set({ recentConversations: recent });
  },

  polishRecords: [],
  loadPolishRecords: async () => {
    const records = await getPolishRecords();
    set({ polishRecords: records });
  },

  // 漂流瓶
  driftBottles: [],
  loadDriftBottles: async () => {
    const me = get().currentMember;
    // 未登录时，仍按 self 兼容历史数据；登录后按当前 memberId 取
    const myId = me?.id || "self";
    const received = await getDriftBottlesByReceiver(myId);
    const sent = await getDriftBottlesBySender(myId);
    set({ driftBottles: [...received, ...sent] });
  },
  sendDriftBottle: async (bottle) => {
    const me = get().currentMember;
    const partner = get().partnerMember;
    // senderId 用当前用户 id；若 bottle.receiverId 仍是 "self"（旧调用方），自动替换为家人 id
    const senderId = me?.id || bottle.senderId || "self";
    const receiverId =
      bottle.receiverId && bottle.receiverId !== "self"
        ? bottle.receiverId
        : partner?.id || bottle.receiverId || "self";
    const newBottle: DriftBottle = {
      ...bottle,
      id: generateId(),
      senderId,
      receiverId,
    };
    await saveDriftBottle(newBottle);
    await get().loadDriftBottles();
  },
  openDriftBottle: async (id) => {
    await updateBottleStatus(id, "opened");
    await get().loadDriftBottles();
  },
  reactToDriftBottle: async (id, reaction) => {
    await updateDriftBottle(id, { reaction, reactedAt: Date.now() });
    await get().loadDriftBottles();
  },

  // 家庭时间轴（派生方法）
  getTimelineEntries: () => {
    const { driftBottles, currentMember, partnerMember } = get();
    return computeTimelineEntries(
      driftBottles,
      currentMember?.id || "",
      partnerMember
    );
  },
  getTimelineStats: () => {
    const { driftBottles } = get();
    return computeTimelineStats(driftBottles);
  },

  // 时光胶囊
  timeCapsules: [],
  loadTimeCapsules: async () => {
    const capsules = await getAllTimeCapsules();
    set({ timeCapsules: capsules });
  },
  createTimeCapsule: async (capsule) => {
    const newCapsule: TimeCapsule = { ...capsule, id: generateId() };
    await saveTimeCapsule(newCapsule);
    await get().loadTimeCapsules();
  },
  openCapsule: async (id) => {
    await updateTimeCapsule(id, { status: "opened" });
    await get().loadTimeCapsules();
  },

  // 情绪气象
  emotionWeather: null,
  recentWeathers: [],
  loadEmotionWeathers: async () => {
    const weathers = await getRecentEmotionWeathers();
    set({ recentWeathers: weathers });
    if (weathers.length > 0) {
      set({ emotionWeather: weathers[0] });
    }
  },
  updateEmotionWeather: async (weather) => {
    await saveEmotionWeather({ ...weather, id: weather.timestamp.toString() });
    await get().loadEmotionWeathers();
  },

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),

  designConfig: designConfigs.child,
}));
