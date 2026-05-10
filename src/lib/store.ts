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
  saveTimeCapsule,
  getAllTimeCapsules,
  saveEmotionWeather,
  getRecentEmotionWeathers,
  initDefaultData,
} from "./db";
import { UserType, designConfigs } from "./designConfig";

interface AppState {
  userProfile: UserProfile | null;
  loadUserProfile: () => Promise<void>;

  userType: UserType;
  setUserType: (type: UserType) => void;

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

  // 时光胶囊
  timeCapsules: TimeCapsule[];
  loadTimeCapsules: () => Promise<void>;
  createTimeCapsule: (capsule: Omit<TimeCapsule, "id">) => Promise<void>;

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
    const received = await getDriftBottlesByReceiver("self");
    const sent = await getDriftBottlesBySender("self");
    set({ driftBottles: [...received, ...sent] });
  },
  sendDriftBottle: async (bottle) => {
    const newBottle: DriftBottle = { ...bottle, id: generateId() };
    await saveDriftBottle(newBottle);
    await get().loadDriftBottles();
  },
  openDriftBottle: async (id) => {
    await updateBottleStatus(id, "opened");
    await get().loadDriftBottles();
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
