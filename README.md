# 安语 (AnYu)

> 让爱，无需言说 —— 基于VIVO原子组件的东方家庭情感传递应用

**2026年中国高校计算机大赛 - AIGC创新赛 参赛作品**

安语是一款面向中国家庭的AI情感传递应用。我们深知，在中国家庭中，65%的成年子女与父母的日常对话几乎只停留在"吃饭"和"身体"。不是不想说，而是说不出口——"妈，你少操点心"删除重打变成"嗯，我挺好的"。

安语利用AIGC大模型（VIVO蓝心大模型 Doubao-Seed-2.0系列），将含蓄的情感意图转化为东方诗意表达，通过VIVO原子组件直接送达家人手机桌面。核心路径：**选一个意象 → AI诗意润色 → 投递 → 家人桌面原子组件接住**，全家无需打开APP。

---

## 功能特性

### 六大核心功能模块

| 功能 | 说明 | AI能力 |
|------|------|--------|
| **写一条** | 三种模式：意象寄送（8种东方意象卡片）、每日心情（6种情绪一秒发送）、一键问候（8句日常关怀） | 诗意润色（drift_bottle） |
| **思绪森林** | 对话式情绪倾诉，AI以共情/追问/归因/轻推四种模式灵活回应，结束后生成心灵回响总结 | 倾听（treehole_listen）、总结（treehole_summary） |
| **贴心翻译** | 输入父母的话语，AI解读背后真实意图，提供四层结果：TA说→真实情感→TA真正想说→可以这样回应 | 代际翻译（translate） |
| **情绪气象** | 日/周/月三种视图的情绪追踪，七日趋势图，8种情绪色彩映射，高情绪时推荐去树洞倾诉 | 情绪洞察（insight） |
| **时光胶囊** | 封存一句话给未来，设定开启日期，到期后揭晓，让爱跨越时间 | — |
| **收件箱** | 查看收到的家书，启读详情抽屉，心动回执，一键回信，构建双向情感闭环 | — |

### 双端差异化设计

安语针对成年子女和年迈父母设计了完全不同的交互体验：

- **孩子端**：全功能开放，紧凑布局，完整体验所有功能
- **父母端**：更大字号（+2级）、更大间距和圆角（考虑视力）、隐藏复杂功能（树洞/情绪气象），专注收信和快速回复

### VIVO原子组件生态

设计了三款桌面原子组件，无需打开APP即可感知家人心意：

| 组件 | 尺寸 | 功能 |
|------|------|------|
| 心湖 | 2x2 (432x432) | 家庭情绪晴雨表 |
| 心意 | 4x2 (924x432) | 桌面上的家书 |
| 写一句 | 2x2 (432x432) | 快速写信入口 |

---

## 技术架构

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | Next.js 14 (App Router) | React全栈框架，SSR/SSG支持 |
| **UI库** | React 18 + TypeScript | 类型安全 |
| **样式** | Tailwind CSS 3 | 原子化CSS，东方美学自定义主题 |
| **状态管理** | Zustand | 轻量级全局状态管理 |
| **本地存储** | Dexie (IndexedDB) | 7张表，全量离线数据持久化 |
| **AI集成** | OpenAI SDK | 兼容VIVO蓝心大模型API |
| **图标系统** | 自定义SVG (30+图标) | 东方美学几何图标 |

### 项目结构

```
src/
├── app/                        # Next.js App Router 页面
│   ├── layout.tsx              # 根布局（PhoneFrame + AuthGuard + BottomNav）
│   ├── page.tsx                # 首页（家庭时间轴/父母端独立首页）
│   ├── login/page.tsx          # 登录页（两组演示账号）
│   ├── bottle/page.tsx         # 写一条（意象寄送/每日心情/一键问候）
│   ├── inbox/page.tsx          # 收件箱（启读/心动/回信）
│   ├── treehole/page.tsx       # 思绪森林（AI情绪倾听）
│   ├── translate/page.tsx       # 贴心翻译（代际话语解读）
│   ├── weather/page.tsx         # 情绪气象（日/周/月视图+趋势图）
│   ├── capsule/page.tsx        # 时光胶囊（封存/开启）
│   ├── records/page.tsx        # 历史记录
│   ├── profile/page.tsx         # 个人中心
│   ├── invite/page.tsx          # 人格邀请（父母人格蒸馏）
│   ├── demo/page.tsx            # 路演自动演示（13场景/150秒）
│   └── api/chat/route.ts       # AI Chat API（三层fallback）
│
├── components/
│   ├── layout/
│   │   ├── AuthGuard.tsx        # 登录守卫
│   │   ├── BottomNav.tsx        # 底部导航（4项+未读badge）
│   │   └── PhoneFrame.tsx       # 手机边框（桌面端iPhone模拟器）
│   └── shared/
│       ├── Icon.tsx             # 东方美学SVG图标系统
│       ├── VoiceInput.tsx      # 语音输入
│       ├── Loading.tsx          # 加载组件
│       └── ErrorMessage.tsx     # 错误提示
│
└── lib/                         # 核心库
    ├── vivo.ts                  # VIVO AI API集成（OpenAI兼容协议）
    ├── prompts.ts               # AI Prompt模板（8种能力）
    ├── fallback.ts              # AI兜底文案库
    ├── types.ts                 # 完整类型定义（20+接口）
    ├── store.ts                 # Zustand全局状态管理
    ├── db.ts                    # Dexie IndexedDB（7张表）
    ├── auth.ts                  # Mock账号系统
    ├── seed.ts                  # 冷启动种子数据
    ├── designConfig.ts          # 双端设计配置
    └── timeline.ts              # 家庭时间轴计算层
```

---

## AI大模型集成

### 模型选型

安语核心调用 **VIVO蓝心大模型（Doubao-Seed-2.0系列）**，通过OpenAI兼容协议接入。

| 参数 | 值 |
|------|-----|
| API地址 | `https://api-ai.vivo.com.cn/v1` |
| 主模型 | `Doubao-Seed-2.0-lite` |
| 备用模型 | `Doubao-Seed-2.0-mini`（仅insight能力） |
| SDK | `openai` (npm) |
| temperature | 0.7（persona为0.3） |
| max_tokens | 4096 |

### 8大AI能力

| 能力标识 | 功能 | Prompt核心策略 |
|----------|------|----------------|
| `treehole_listen` | 树洞情绪倾听 | 东方心灵倾听者，共情/追问/归因/轻推四种模式，口语化2-4句 |
| `treehole_summary` | 倾诉总结+情绪画像 | 心理分析：父母动机分析+行动建议+JSON情绪画像 |
| `persona` | 父母人格蒸馏 | 大五人格+五维价值观+语言习惯+冲突模型+代际印记 |
| `simulation` | 镜像模拟对话 | 扮演真实父母，含蓄关心不直接表达，1-3句微信风格 |
| `polish` | 非暴力沟通润色 | 先共情→说感受不说指责→表达需求→给承诺/台阶 |
| `insight` | 情绪洞察摘要 | 高频话题+情绪模式+行动建议 |
| `translate` | 代际话语翻译 | 读懂父母"唠叨"背后的关心，将"催促"还原为"牵挂" |
| `drift_bottle` | 漂流瓶诗歌生成 | 东方意境诗歌（4-6句），自然意象（灯/茶/风/月） |

### 三层降级策略

为保证路演现场不出现功能哑火，设计了完善的三层降级：

```
用户操作 → 调用AI API
    ↓ 失败
Layer 1: 无API Key → 直接返回预写fallback文案
    ↓ 失败
Layer 2: AI返回空内容 → 返回fallback文案
    ↓ 失败
Layer 3: AI调用异常 → 返回fallback文案
    ↓ 失败
Layer 4: 请求解析失败 → 200 + fallback（保证UI不断流）
```

fallback文案按意象关键词分类（灯/光/夜→温暖、茶/拥抱→关怀、家书/落叶→回忆），确保即使无AI也能传递有温度的内容。

### 调用流程

```
前端页面 → POST /api/chat { capability, messages, stream }
         → route.ts 注入system prompt
         → vivo.ts 通过OpenAI SDK调用VIVO API
         → 返回JSON（非流式）或SSE流（流式）
         → 前端渲染结果
```

---

## 数据存储

使用 **Dexie (IndexedDB)** 实现全量本地数据持久化，7张表覆盖所有业务数据：

| 表名 | 主键 | 索引 | 用途 |
|------|------|------|------|
| `conversations` | id | type, createdAt | 对话记录（树洞/练手/润色） |
| `polishRecords` | id | createdAt | AI润色改写记录 |
| `userProfile` | id | — | 用户画像 |
| `parentProfiles` | id | — | 父母人格档案 |
| `driftBottles` | id | senderId, receiverId, sentAt | 漂流瓶/家书 |
| `timeCapsules` | id | createdAt | 时光胶囊 |
| `emotionWeathers` | id(timestamp) | timestamp | 情绪气象记录 |

---

## 设计系统

### 东方美学色彩体系

源自汝窑青瓷与传统宣纸：

| 色彩 | 色值 | 含义 |
|------|------|------|
| 天青色 | `#A3B8C6` | 宁静、平和、自然，主色调贯穿界面 |
| 藕粉色 | `#E6D5D5` | 温柔、关怀、亲密，关键按钮与积极反馈 |
| 月白色 | `#F5F5F3` | 希望、启发，辅助背景引导视觉动线 |
| 米白色 | `#FDFBF8` | 宣纸、亚麻，界面基底色 |

### 动画系统

`globals.css` 定义了丰富的东方风格CSS动画：

| 动画 | 用途 | 时长 |
|------|------|------|
| `breathing` | 树洞呼吸引导 | 4s |
| `float` / `float-slow` | 卡片浮动 | 4s/6s |
| `ripple` / `ripple-slow` | 涟漪扩散 | 3s/5s |
| `fall` | 树洞落叶 | 6s |
| `glow` | 辉光效果 | 4s |
| `bottle-float` | 漂流瓶浮动 | 5s |
| `petal` | 花瓣飘落 | 5s |

### 双端设计配置

通过 `designConfig.ts` 控制双端视觉差异：

- **孩子端**：较小字号/紧凑间距/全功能开启
- **父母端**：更大字号（+2级）/更大间距（+25%）/更大圆角/隐藏树洞和情绪气象

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/ZeeeKun1/FamilyBridge.git
cd FamilyBridge

# 安装依赖
npm install

# 配置环境变量（可选，不配置时使用fallback文案）
cp .env.example .env.local
# 编辑 .env.local 填入 VIVO_API_KEY

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 即可访问。

### 演示账号

| 用户名 | 密码 | 角色 | 显示名 |
|--------|------|------|--------|
| `child` | `1234` | 孩子端 | 小语 |
| `parent` | `1234` | 父母端 | 妈妈 |

> 两个账号属于同一家庭，可在两台设备/两个浏览器分别登录，体验双向家书收发。

### 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `VIVO_API_KEY` | 否（有fallback） | VIVO AI API密钥 |
| `VIVO_BASE_URL` | 否 | 默认 `https://api-ai.vivo.com.cn/v1` |

> 不配置API Key时，所有AI功能会自动降级为预写的诗意文案，不影响功能演示。

### 构建生产版本

```bash
npm run build
npm start
```

---

## 路演演示

项目内置了自动路演演示页面，13个场景自动切换，总时长约150秒：

```
访问 http://localhost:3000/demo → 点击"开始演示"
```

演示流程：
1. 登录孩子端 → 2. 首页展示 → 3. 选择意象 → 4. AI润色预览 → 5. 发送成功
→ 6. 切换父母端 → 7. 桌面通知弹窗（模拟VIVO原子组件）→ 8. 父母首页
→ 9. 查看家书 → 10. 心动+回信 → 11. 收到回信通知 → 12. 验证回执 → 13. 结束

---

## 核心文件索引

### AI相关代码

| 文件 | 说明 |
|------|------|
| `src/lib/vivo.ts` | VIVO AI API集成，OpenAI兼容协议封装 |
| `src/lib/prompts.ts` | 8种AI能力的System Prompt模板 + 模型映射 |
| `src/lib/fallback.ts` | 三层降级策略的fallback文案库 |
| `src/app/api/chat/route.ts` | AI Chat API路由，含流式SSE支持 |

### 数据与状态

| 文件 | 说明 |
|------|------|
| `src/lib/types.ts` | 完整类型定义（20+接口） |
| `src/lib/store.ts` | Zustand全局状态管理 |
| `src/lib/db.ts` | Dexie IndexedDB封装（7张表） |

### 设计与配置

| 文件 | 说明 |
|------|------|
| `src/lib/designConfig.ts` | 双端设计配置（字号/间距/圆角/功能开关） |
| `src/app/globals.css` | 东方美学色彩体系 + CSS动画系统 |
| `tailwind.config.ts` | Tailwind自定义主题（天青/藕粉/月白/米白） |

---

## 团队

**安语团队** - 南开大学

| 姓名 | 角色 |
|------|------|
| 宋泽坤 | 产品经理 |
| 王苑婷 | UI与交互设计 |
| 许湘婷 | 服务端开发 |
| 张达 | AI后端/模型部署 |
| 沈永腾 | 前端开发 |

指导老师：高楠、陈予

---

## 许可证

MIT License - Copyright (c) 2026 ZeeeKun1
