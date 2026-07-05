import Dexie, { Table } from "dexie";
import {
  Conversation,
  PolishRecord,
  UserProfile,
  ParentProfile,
  DriftBottle,
  TimeCapsule,
  EmotionWeather,
} from "./types";

class AnYuDB extends Dexie {
  conversations!: Table<Conversation, string>;
  polishRecords!: Table<PolishRecord, string>;
  userProfile!: Table<UserProfile, string>;
  parentProfiles!: Table<ParentProfile, string>;
  driftBottles!: Table<DriftBottle, string>;
  timeCapsules!: Table<TimeCapsule, string>;
  emotionWeathers!: Table<EmotionWeather, string>;

  constructor() {
    super("an_yu");
    this.version(2).stores({
      conversations: "id, type, createdAt",
      polishRecords: "id, createdAt",
      userProfile: "id",
      parentProfiles: "id",
      driftBottles: "id, senderId, receiverId, sentAt",
      timeCapsules: "id, createdAt",
      emotionWeathers: "timestamp",
    });
  }
}

export const db = new AnYuDB();

// ===== 便捷 CRUD =====

export async function saveConversation(conv: Conversation) {
  return db.conversations.put(conv);
}

export async function getConversation(id: string) {
  return db.conversations.get(id);
}

export async function getRecentConversations(limit = 10) {
  return db.conversations.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function savePolishRecord(record: PolishRecord) {
  return db.polishRecords.put(record);
}

export async function getPolishRecords(limit = 10) {
  return db.polishRecords.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function getUserProfile(): Promise<UserProfile | undefined> {
  return db.userProfile.get("self");
}

export async function saveUserProfile(profile: UserProfile) {
  return db.userProfile.put({ ...profile, id: "self" });
}

export async function getParentProfile(
  id: string
): Promise<ParentProfile | undefined> {
  return db.parentProfiles.get(id);
}

export async function saveParentProfile(profile: ParentProfile) {
  return db.parentProfiles.put(profile);
}

export async function getAllParentProfiles() {
  return db.parentProfiles.toArray();
}

// ===== 漂流瓶 =====

export async function saveDriftBottle(bottle: DriftBottle) {
  return db.driftBottles.put(bottle);
}

export async function getDriftBottlesByReceiver(receiverId: string) {
  return db.driftBottles
    .where("receiverId")
    .equals(receiverId)
    .reverse()
    .toArray();
}

export async function getDriftBottlesBySender(senderId: string) {
  return db.driftBottles
    .where("senderId")
    .equals(senderId)
    .reverse()
    .toArray();
}

export async function updateBottleStatus(id: string, status: DriftBottle["status"]) {
  return db.driftBottles.update(id, { status, openedAt: status === "opened" ? Date.now() : undefined });
}

export async function updateDriftBottle(id: string, changes: Partial<DriftBottle>) {
  return db.driftBottles.update(id, changes);
}

// ===== 时光胶囊 =====

export async function saveTimeCapsule(capsule: TimeCapsule) {
  return db.timeCapsules.put(capsule);
}

export async function getAllTimeCapsules() {
  return db.timeCapsules.orderBy("createdAt").reverse().toArray();
}

export async function getTimeCapsule(id: string) {
  return db.timeCapsules.get(id);
}

export async function updateTimeCapsule(id: string, updates: Partial<TimeCapsule>) {
  return db.timeCapsules.update(id, updates);
}

// ===== 情绪气象 =====

export async function saveEmotionWeather(weather: EmotionWeather) {
  return db.emotionWeathers.put({ ...weather, id: weather.timestamp.toString() });
}

export async function getRecentEmotionWeathers(limit = 30) {
  return db.emotionWeathers.orderBy("timestamp").reverse().limit(limit).toArray();
}

// 初始化默认数据
export async function initDefaultData() {
  const user = await getUserProfile();
  if (!user) {
    await saveUserProfile({
      emotionPatterns: [],
      triggerWords: [],
      communicationStyle: "",
      conflictFrequency: 0,
      topicTags: [],
      updatedAt: Date.now(),
    });
  }

  const mom = await getParentProfile("mom");
  if (!mom) {
    await saveParentProfile({
      id: "mom",
      displayName: "妈妈",
      linked: false,
      updatedAt: Date.now(),
    });
  }

  const dad = await getParentProfile("dad");
  if (!dad) {
    await saveParentProfile({
      id: "dad",
      displayName: "爸爸",
      linked: false,
      updatedAt: Date.now(),
    });
  }
}
