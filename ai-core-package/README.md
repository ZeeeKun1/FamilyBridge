# 安语 - AI核心功能调用大模型代码包

> 2026年中国高校计算机大赛 - AIGC创新赛 | 安语团队（南开大学）

本代码包为安语项目中**调用VIVO蓝心大模型的核心代码**，包含API集成层、8种AI能力的Prompt模板、三层降级兜底策略，以及完整类型定义。

---

## 代码结构

```
ai-core-package/
├── README.md                    # 本说明文件
├── api/
│   ├── vivo.ts                  # VIVO AI API集成（OpenAI兼容协议封装）
│   └── chat-route.ts            # AI Chat API路由（Next.js Route Handler）
├── prompts/
│   └── prompts.ts               # 8种AI能力的System Prompt模板 + 模型映射
├── config/
│   ├── types.ts                 # 完整类型定义（AI请求/响应/人格档案等）
│   └── fallback.ts              # 三层降级策略的fallback文案库
```

---

## 大模型调用说明

### 模型配置

| 参数 | 值 |
|------|-----|
| API地址 | `https://api-ai.vivo.com.cn/v1` |
| 主模型 | `Doubao-Seed-2.0-lite` |
| 备用模型 | `Doubao-Seed-2.0-mini`（仅insight能力） |
| SDK | `openai` (npm) v6+ |
| temperature | 0.7（persona为0.3） |
| max_tokens | 4096 |

### 调用流程

```
客户端 → POST /api/chat { capability, messages, stream }
         → chat-route.ts 注入对应system prompt
         → vivo.ts 通过OpenAI SDK调用VIVO蓝心大模型
         → 返回JSON（非流式）或SSE流式响应
```

### 8种AI能力

| capability | 功能 | 使用的Prompt | 模型 |
|------------|------|-------------|------|
| `treehole_listen` | 树洞情绪倾听 | TREEHOLE_LISTEN_PROMPT | Doubao-Seed-2.0-lite |
| `treehole_summary` | 倾诉总结+情绪画像 | TREEHOLE_SUMMARY_PROMPT | Doubao-Seed-2.0-lite |
| `persona` | 父母人格蒸馏 | PERSONA_DISTILL_PROMPT | Doubao-Seed-2.0-lite |
| `simulation` | 镜像模拟对话 | MIRROR_SIMULATION_PROMPT | Doubao-Seed-2.0-lite |
| `polish` | 非暴力沟通润色 | POLISH_PROMPT | Doubao-Seed-2.0-lite |
| `insight` | 情绪洞察摘要 | INSIGHT_PROMPT | Doubao-Seed-2.0-mini |
| `translate` | 代际话语翻译 | TRANSLATE_PROMPT | Doubao-Seed-2.0-lite |
| `drift_bottle` | 漂流瓶诗歌生成 | DRIFT_BOTTLE_PROMPT | Doubao-Seed-2.0-lite |

---

## 核心文件详解

### 1. `api/vivo.ts` — VIVO AI API集成

封装了与VIVO蓝心大模型的通信层，基于OpenAI SDK的兼容协议：

```typescript
const client = new OpenAI({
  apiKey: process.env.VIVO_API_KEY || "",
  baseURL: "https://api-ai.vivo.com.cn/v1",
});

// 非流式调用
export async function vivoChat(capability, messages) { ... }

// 流式调用（SSE）
export async function vivoChatStream(capability, messages) { ... }

// 便捷调用（自动拼接历史+当前消息）
export async function handleAIChat(capability, userMessage, history) { ... }
```

**核心设计**：
- 根据 `capability` 自动从 `MODEL_MAP` 选择模型
- `persona` 能力使用低 temperature（0.3），其他使用 0.7
- 支持 streaming 和 non-streaming 两种模式

### 2. `api/chat-route.ts` — AI Chat API路由

Next.js API Route，前端通过 POST 请求调用：

```typescript
POST /api/chat
Body: {
  capability: AICapability,  // AI能力标识
  messages: Message[],         // 对话历史
  stream?: boolean              // 是否流式
}
```

**三层降级策略**：
1. 无 API Key → 直接返回 fallback 文案
2. AI 返回空内容 → 返回 fallback 文案
3. AI 调用异常 → 返回 fallback 文案
4. 请求解析失败 → 200 + fallback（保证UI不断流）

### 3. `prompts/prompts.ts` — Prompt模板库

包含8个精心设计的 System Prompt，每个Prompt对应一种AI能力：

- **TREEHOLE_LISTEN_PROMPT**：东方心灵倾听者，共情/追问/归因/轻推四种模式
- **TREEHOLE_SUMMARY_PROMPT**：心理分析总结，含JSON情绪画像输出
- **PERSONA_DISTILL_PROMPT**：多维度人格蒸馏（大五人格+五维价值观+语言习惯+冲突模型）
- **MIRROR_SIMULATION_PROMPT**：镜像模拟（扮演真实父母）
- **POLISH_PROMPT**：非暴力沟通话术改写（输出JSON）
- **INSIGHT_PROMPT**：情绪洞察摘要
- **TRANSLATE_PROMPT**：代际话语翻译
- **DRIFT_BOTTLE_PROMPT**：漂流瓶诗歌生成

同时定义了 `SYSTEM_PROMPTS` 和 `MODEL_MAP` 两个映射表。

### 4. `config/fallback.ts` — 兜底文案库

当AI不可用时，按 capability 和意象关键词返回预写的诗意文案：

- 漂流瓶按意象分类：灯/光/夜→温暖、茶/拥抱→关怀、家书/落叶→回忆
- 其他能力各有专属fallback文案
- 确保**即使完全没有AI，产品也能正常演示**

### 5. `config/types.ts` — 类型定义

完整的TypeScript类型定义（20+接口），包括：

- `AICapability`：8种AI能力枚举
- `AIRequest`：AI请求结构
- `PersonalityProfile`：人格档案（大五人格+价值观+语言DNA+冲突模型）
- `Message` / `Conversation`：对话结构
- `TranslationResult`：翻译结果
- `EmotionWeather`：情绪气象
- `DriftBottle`：家书/漂流瓶

---

## 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `VIVO_API_KEY` | 否 | VIVO AI API密钥，不配置时使用fallback文案 |
| `VIVO_BASE_URL` | 否 | 默认 `https://api-ai.vivo.com.cn/v1` |

---

## 依赖

```json
{
  "openai": "^6.36.0"
}
```

仅需 `openai` SDK 一个外部依赖。

---

## 设计亮点

1. **OpenAI兼容协议**：通过标准OpenAI SDK接入VIVO蓝心大模型，切换成本低
2. **按能力选择模型**：不同AI能力使用不同的模型（lite/mini），平衡效果与性能
3. **三层降级保障**：API不可用→返回空→调用异常→解析失败，每一层都有兜底
4. **东方文化定制Prompt**：8个Prompt全部围绕中国家庭含蓄沟通场景设计
5. **诗意fallback**：兜底文案不是错误提示，而是按意象分类的东方诗意短句
