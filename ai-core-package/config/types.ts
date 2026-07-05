// ===== 人格档案 =====

export interface ValueSpectrum {
  filial_vs_autonomy: DimensionScore;
  stability_vs_risk: DimensionScore;
  collectivism_vs_individualism: DimensionScore;
  authority_vs_innovation: DimensionScore;
  external_vs_internal: DimensionScore;
}

export interface DimensionScore {
  score: number;
  description: string;
  evidence: string;
}

export interface CommunicationDNA {
  tone: string;
  catchphrases: string[];
  syntax_habit: string;
  verbatim_samples: string[];
}

export interface ConflictModel {
  logic_chain: string;
  emotional_triggers: string[];
  defense_mechanisms: string[];
  cognitive_biases: string[];
}

export interface BasicInfo {
  core_identity: string;
  generational_archetype: string;
}

export interface PersonalityProfile {
  basic_info: BasicInfo;
  psychological_drivers: {
    value_spectrum: ValueSpectrum;
    core_traits: string[];
  };
  communication_dna: CommunicationDNA;
  conflict_model: ConflictModel;
}

// ===== 对话 =====

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  pattern?: string;
}

export type ConversationType = "treehole" | "practice" | "polish";

export interface VentProfile {
  highFreqEmotion: string;
  triggerTopic: string;
  coreNeed: string;
  topicTags: string[];
}

export interface Conversation {
  id: string;
  type: ConversationType;
  parentId?: string;
  messages: Message[];
  emotionSnapshot?: EmotionResult;
  summaryProfile?: VentProfile;
  summaryContent?: string;
  createdAt: number;
}

// ===== 情绪 =====

export interface EmotionResult {
  emotions: { label: string; intensity: number }[];
  summary: string;
}

// ===== 改写 =====

export interface PolishRecord {
  id: string;
  originalText: string;
  polishedText: string;
  techniques: Technique[];
  sourceConversationId?: string;
  createdAt: number;
}

export interface Technique {
  name: string;
  description: string;
}

// ===== 用户 & 父母画像 =====

export interface UserProfile {
  id?: string;
  profile?: PersonalityProfile;
  emotionPatterns: string[];
  triggerWords: string[];
  communicationStyle: string;
  conflictFrequency: number;
  topicTags: string[];
  updatedAt: number;
  isParent?: boolean;
}

// ===== 卡片类型定义 =====

export type CardType = "treehole" | "bottle" | "weather" | "capsule" | "translate" | "records";

export interface CardConfig {
  id: CardType;
  enabled: boolean;
  order: number;
}

export interface UserCardSettings {
  cards: CardConfig[];
  updatedAt: number;
}

export type ParentId = "mom" | "dad";

export interface ParentProfile {
  id: ParentId;
  displayName: string;
  profile?: PersonalityProfile;
  linked: boolean;
  updatedAt: number;
}

// ===== 账号 & 家庭 =====
// 登录态：一个 familyId 下若干成员；当前登录用户绑定其中一个成员。
// 用户类型不再可以随意切换，由登录账号决定。

export type FamilyRole = "child" | "parent";

export interface FamilyMember {
  id: string;          // 成员唯一 id
  familyId: string;    // 同一 familyId 下视为同一家庭
  role: FamilyRole;    // child / parent
  displayName: string; // 显示名
  relation: string;    // 关系（孩子/妈妈/爸爸/...）
  avatarTone: string;  // 头像底色 token（"oupink" / "tianqing" / ...）
}

export interface AuthAccount {
  username: string;    // 测试账号用户名
  password: string;    // 测试账号密码（仅 mock）
  memberId: string;    // 绑定的家庭成员 id
}

export interface Session {
  memberId: string;
  loggedAt: number;
}

// ===== AI 请求 =====

export type AICapability =
  | "treehole_listen"
  | "treehole_summary"
  | "persona"
  | "simulation"
  | "polish"
  | "insight"
  | "translate"
  | "drift_bottle"
  | "time_capsule";

export interface AIRequest {
  capability: AICapability;
  messages: Pick<Message, "role" | "content">[];
  stream?: boolean;
}

// ===== 漂流�?=====

export interface ImageryCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "warmth" | "care" | "apology" | "celebration" | "memory";
  poem?: string;
  animation?: string;
}

// 寄送模式：
// - imagery：从意象卡寄送（默认）
// - daily：每日心情（3 秒选一个心情图标）
// - greeting：一键问候（高频短句）
// - polish：用户先写原话，再由 AI 润色（P6 显性化）
export type DriftBottleMode = "imagery" | "daily" | "greeting" | "polish";

// 收件人心动回执（P5）："heart" 表示心动一下
export type DriftBottleReaction = "heart";

export interface DriftBottle {
  id: string;
  senderId: string;
  receiverId: string;
  imageryId: string;
  imageryName: string;
  customMessage?: string;
  // 用户最初写的原话（仅 polish 模式存）——用于发件人/收件人查看 AI 改写前后对比
  originalText?: string;
  mode?: DriftBottleMode;
  poem: string;
  status: "sent" | "received" | "opened";
  sentAt: number;
  openedAt?: number;
  // 收件人对这封心意的反馈（P5）
  reaction?: DriftBottleReaction;
  reactedAt?: number;
}

// ===== 时光胶囊 =====

export interface MemoryItem {
  id: string;
  type: "photo" | "video" | "voice" | "text";
  content: string;
  caption?: string;
  timestamp: number;
  tags: string[];
}

export interface TimeCapsule {
  id: string;
  content: string;
  createdAt: number;
  openAt: number;
  status: "sealed" | "opened";
}

// ===== 翻译�?=====

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  interpretation: string;
  emotionalIntent: string;
  suggestedResponse: string;
}

// ===== 情绪气象 =====

export type EmotionState = "calm" | "ripple" | "wave" | "storm";

export interface EmotionWeather {
  id?: string;
  state: EmotionState;
  primaryEmotion: string;
  intensity: number;
  trend: "up" | "down" | "stable";
  timestamp: number;
}

// ===== 家庭时间轴（计算派生，不持久化） =====

export type TimelineGroup = "today" | "thisWeek" | "thisMonth" | "earlier";

export interface TimelineEntry {
  bottle: DriftBottle;
  group: TimelineGroup;
  dateLabel: string;
  timeLabel: string;
  isSpecial: boolean;
  specialLabel?: string;
  seasonTag?: string;
  direction: "sent" | "received";
  senderName: string;
  receiverName: string;
  isUnread: boolean;
}

export interface TimelineStats {
  totalMessages: number;
  firstMessageDate: number | null;
  daysSinceFirst: number;
  sentCount: number;
  receivedCount: number;
  unreadCount: number;
  heartCount: number;
}
