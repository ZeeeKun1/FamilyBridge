# 评审档案 #0001 — 产品级独立审查

> 评审日期：2026-06-23
> 评审员视角：独立产品/UX/市场审查员（非代码风格审查）
> 评审范围：全项目（src/ + vivo-widget-package/）
> 评审维度：需求与场景可信度 / 产品可落地性 / 竞品与差异化

---

## 0. 用户诉求锚点

> "我觉得这个产品还不足以达到比赛的要求，也就是，用户的需求是什么，真正的落地级别的产品，目前已有的功能全是我的嘴说，而不是从市场的角度，用设计思维来思考这件事情是否可行。"
>
> "我的诉求其实就是，这个产品目前还是太停留于想法，需要有一个独立的智能体去审查我这个项目做的好不好。"

---

## 1. 结论速读

⚠️ **当前状态：开发者自嗨型 demo，距离比赛级落地产品差 3 个关键层级。**

- App 完成度 ~70%（视觉/动画/页面齐全）
- VIVO 原子组件完成度 ~30%（manifest 写好但未真机验证）
- 市场/用户论证完成度 ~10%（全凭直觉，无任何访谈数据）

---

## 2. 问题清单（共 16 项）

### 🔴 致命级（5 项 — 影响比赛通过 / 产品成立）

| No. | 标题 | 证据 |
|---|---|---|
| 1 | 没有真实的"传递"通道，所有"心意"都是本地自言自语 | `src/lib/store.ts` 160-183：sendDriftBottle 仅写本地 Dexie；receiverId 写死 "self" |
| 2 | VIVO 原子组件只是"Web 模拟图"，未在真机/模拟器跑通 | `src/app/components-showcase/page.tsx` 全为 React 模拟；`vivo-widget-package/` 未验证 |
| 3 | "含蓄情感传递"的痛点真实性未经过任何用户验证 | `src/app/pitch-deck/page.tsx` 全是虚构对白，无访谈数据 |
| 4 | 没有数据持久身份系统，"漂流瓶"接收者永远是同一台设备的自己 | `src/lib/store.ts` 168-171：getDriftBottlesByReceiver("self") |
| 5 | AI 依赖 VIVO_API_KEY，演示前未配置则核心功能哑火 | `src/app/api/chat/route.ts` 失败直接 500，无 mock 兜底 |

### 🟠 重要级（7 项 — 影响产品说服力）

| No. | 标题 | 证据 |
|---|---|---|
| 6 | 价值主张和功能列表不匹配，主线被支线稀释 | `src/app/page.tsx` 264-274：支线四联仍占首页主屏 |
| 7 | 冷启动空状态会直接劝退用户 | `src/app/bottle/page.tsx` 222-228：未添加家人就只显示一句话 |
| 8 | 竞品差异化未正面回答"和微信/家庭群/相册有啥本质区别" | `src/app/pitch-deck/page.tsx` 缺竞品分析章节 |
| 9 | 父母端用户根本不会下载独立 App | `src/app/page.tsx` 36-75：父母端为完整 App 形态 |
| 10 | 意象卡片仍用 emoji，与"东方美学"主张冲突 | `src/app/bottle/page.tsx` 9-18；`src/app/profile/page.tsx` 37-55 |
| 11 | "用户类型切换"是开发者按钮，不是产品功能 | `src/app/profile/page.tsx` 88-101 |
| 12 | 路演 5 幕自我感动多于商业逻辑（缺市场/壁垒/商业模式） | `src/app/pitch-deck/page.tsx` |

### 🟡 改进项（4 项）

| No. | 标题 |
|---|---|
| 13 | 收件箱"已读珍藏"无法点开复盘 |
| 14 | 三个原子组件之间未讲清楚"为什么是这三个"形成动作链 |
| 15 | invite 测了"父母人格"但 AI 文案没用上 profile |
| 16 | 缺少埋点/数据看板，路演无法说"留存/激活" |

---

## 3. 修复决策

用户决定：**修全部致命项（1-5）+ 重要项（6-12）共 12 项**

改进项（13-16）本轮暂缓，留到下一次评审。

---

## 4. 修复步骤记录（按 todo 顺序）

> 每步会在此处追加：动机 → 改动文件 → 关键代码 → 结果

### Step 0 — 建立评审档案
- 动机：用户要求"每次评审有记录、修改步骤想法可回溯"。
- 改动：新建 [docs/REVIEWS/0001-product-review.md](file:///h:/Master Work/VIVO/family-bridge/docs/REVIEWS/0001-product-review.md)。
- 结果：本次审查与后续修改全部沉淀于此。

### Step 1 — 路演策略调整（用户决策修正）
- 动机：用户原话——"路演部分不应该在我们的APP里面呈现，这是PPT里面要写的内容"。
- 改动：
  - [src/app/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/page.tsx)：主线第 4 格"路演故事"移除，替换为"情绪气象"。
  - 新建 [docs/REVIEWS/0001-pitch-ppt-outline.md](file:///h:/Master Work/VIVO/family-bridge/docs/REVIEWS/0001-pitch-ppt-outline.md)：把原 5 幕迁出为 PPT 大纲，并补全竞品对比表、商业可行性、MVP 指标、现场演示脚本。
  - `/pitch-deck` 路由保留但不在主导航出现（避免成为产品的一部分）。
- 结果：致命2/3、重要8/12 全部沉淀到 PPT 文档，App 内不再做自我介绍。

### Step 2 — 账号体系 + 两组测试账号（合并致命4 / 重要9 / 重要11）
- 动机：用户原话——"父母端应当在登陆时就进行区分，而不是任意进行切换。我觉得我们可以预先设计一组账号，父母和孩子的一组账号，以供测试"。
- 思路：
  - 抛弃"profile 页一个按钮就能切换身份"的开发者模式；
  - 引入 mock 登录系统 + 一个 demo 家庭（family_demo_01）+ 两个固定测试账号 `child/1234`、`parent/1234`；
  - 全局 AuthGuard 守卫，登录后 currentMember / partnerMember 都从同一家庭自动派生。
- 改动：
  - [src/lib/types.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/types.ts)：新增 FamilyRole / FamilyMember / AuthAccount / Session 模型。
  - 新建 [src/lib/auth.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/auth.ts)：DEMO_FAMILY_ID + DEMO_MEMBERS（小语 + 妈妈）+ DEMO_ACCOUNTS + getOtherMember / login / logout / getSession。
  - 新建 [src/app/login/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/login/page.tsx)：完整登录页，含两组"一键登录"演示账号卡片。
  - 新建 [src/components/layout/AuthGuard.tsx](file:///h:/Master Work/VIVO/family-bridge/src/components/layout/AuthGuard.tsx)：未登录强制跳 `/login`（白名单：`/login`）。
  - [src/app/layout.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/layout.tsx)：将 AuthGuard 挂在 children 外层。
  - [src/lib/store.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/store.ts)：新增 currentMember / partnerMember / hydrateSession / login / logout；userType 与 designConfig 改为从 currentMember.role 派生。
  - [src/app/profile/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/profile/page.tsx)：完整重写，删除身份切换按钮（下沉为连点 5 次标题的隐藏调试入口），加退出登录、当前账号卡、家庭成员展示。
- 结果：父母/孩子在登录时即固化角色，profile 不再暴露身份切换；同家庭 partnerMember 自动联通。

### Step 3 —【致命1】真实接收人 + 收件箱双向视图
- 动机：原 sendDriftBottle 把 receiverId 写死 "self"，本地自言自语；inbox 也只能过滤 "self"。
- 改动：
  - [src/lib/store.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/store.ts)：sendDriftBottle 改为以 currentMember.id 当 senderId，receiverId 若为占位 "self" 则替换为 partnerMember.id；loadDriftBottles 也以 me.id 取。
  - [src/app/bottle/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/bottle/page.tsx)：完全重写接收人选择步骤——锁定为 partnerMember，删除 parentProfiles 多选；写入时 senderId=currentMember.id、receiverId=partnerMember.id。
  - [src/app/inbox/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/inbox/page.tsx)：unread/opened 改为按 receiverId === currentMember.id 过滤；新增 "我寄出" 统计 + "我寄出的心意" section，让发件人也能看到对话另一半。
- 结果：双端账号互登 → 发出 → 对方收到，链路打通。

### Step 4 —【致命5】AI 兑底文案库
- 动机：路演现场最怕 VIVO_API_KEY 缺失或调用异常导致核心动作哑火。
- 改动：
  - 新建 [src/lib/fallback.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/fallback.ts)：按 capability + 意象关键词的预写诗意文案库。
  - [src/app/api/chat/route.ts](file:///h:/Master Work/VIVO/family-bridge/src/app/api/chat/route.ts)：三层兑底——① 无 VIVO_API_KEY 直接返回 fallback；② AI 返回空内容也兑底；③ AI 调用抛错降级；④ 请求解析失败也 200 + fallback（不让 UI 断流）。
  - [src/app/bottle/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/bottle/page.tsx)：客户端也加本地兑底，双保险。
- 结果：哪怕完全离线，路演时"生成诗意"也能秒出文案。

### Step 5 —【重要7】冷启动种子数据
- 动机：评委登录后看到空收件箱会立刻怀疑产品。
- 改动：
  - 新建 [src/lib/seed.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/seed.ts)：每个账号首登（localStorage 标记）时，给该账号塞一封来自对方的真实 DriftBottle（孩子端收到妈妈的"一盏暖灯"；妈妈端收到孩子的"一杯热茶"）。
  - [src/lib/store.ts](file:///h:/Master Work/VIVO/family-bridge/src/lib/store.ts)：在 login 与 hydrateSession 成功后 fire-and-forget 调用 seedDemoDataIfNeeded。
- 结果：登录即有家书在等，演示首屏即"温度感"。

### Step 6 —【重要10】剩余 emoji → 几何图标
- 动机：意象用 emoji 与"东方美学"主张直接矛盾。
- 改动：
  - [src/app/bottle/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/bottle/page.tsx)：意象卡、分类标签、空状态、预览页全部替换为 Icon + IconNames。
  - [src/app/profile/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/profile/page.tsx)（Step 2 内完成同步）。
- 结果：UI 视觉与"几何 + 东方意象"语言收口一致。

### Step 7 —【重要6】首页支线区加"未来规划"标签
- 动机：让评委一眼分清"主线已实现 / 支线为规划"，避免被支线稀释印象。
- 改动：[src/app/page.tsx](file:///h:/Master Work/VIVO/family-bridge/src/app/page.tsx)：SecondaryGrid 顶部增加"轻支线"标题 + 右侧"未来规划"小徽章；同时把支线第 1 格"情绪气象"移到主线（因为主线第 4 格替换了"路演"），支线补入"人格邀请"。
- 结果：主线 4 项（写一条 / 原子组件 / 收件箱 / 情绪气象）+ 支线 4 项（时光胶囊 / 思绪森林 / 贴心翻译 / 人格邀请，明标"未来规划"）。

---

## 5. 收尾验证

- 编译：`npx next lint --quiet` → ✔ No ESLint warnings or errors；`npx tsc --noEmit` → 通过。
- 路由连通自测清单（待人工跑一遍）：
  - [ ] 未登录访问任意页 → 跳 `/login`
  - [ ] child/1234 登录 → 首屏不空（有种子家书）
  - [ ] 写一条 → 选意象 → 接收人锁定为"妈妈" → 投出
  - [ ] 退出登录 → parent/1234 登录 → inbox 能看到刚才那封
  - [ ] parent 端再发一条 → child 重新登录能看到
- 未解决项（留给评审 #0002）：
  - 改进项 13 ~ 16
  - 致命2/3 的真机验证（需要 VIVO 设备）和真实用户访谈数据

