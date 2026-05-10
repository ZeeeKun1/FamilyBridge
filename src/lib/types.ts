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

export interface DriftBottle {
  id: string;
  senderId: string;
  receiverId: string;
  imageryId: string;
  imageryName: string;
  customMessage?: string;
  poem: string;
  status: "sent" | "received" | "opened";
  sentAt: number;
  openedAt?: number;
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
  title: string;
  description?: string;
  memories: MemoryItem[];
  createdAt: number;
  scheduledDate?: number;
  sharedWith: string[];
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
