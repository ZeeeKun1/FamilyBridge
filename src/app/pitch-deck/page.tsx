/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
// NOTE: 此页已从主导航下架（见 docs/REVIEWS/0001-product-review.md Step 1），
// 内容迁至 docs/REVIEWS/0001-pitch-ppt-outline.md 作为 PPT 大纲。
// 文件保留仅为后续可能的开发者预览，关闭对应 lint 规则以免阻塞 build。
"use client";

import { useState } from "react";

// ============================================================
// 「安语」比赛路演故事页
// 叙事主线：东方家庭"说不出口"的情感困境 → 温柔的解决方案
// 适配场景：路演 PPT 风格 + 手机演示
// ============================================================

// ---------- 叙事章节类型 ----------
type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  scene?: string; // 情感场景描述
  highlight?: string; // 核心金句
  component?: React.ReactNode; // 组件演示
};

// ---------- 场景 1：开场 - 抛痛点 ----------
function Scene1() {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-rose-50/80 to-oupink/20 rounded-3xl p-6 border border-rose-100/50">
        <div className="text-center">
          <p className="text-xs text-rose-400 tracking-[0.4em] mb-3">真实的生活场景</p>

          {/* 微信对话模拟 */}
          <div className="max-w-[260px] mx-auto space-y-3">
            {/* 妈妈发来 */}
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-[9px] text-rose-600 font-medium flex-shrink-0">
                妈
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-gray-100 max-w-[180px]">
                <p className="text-[12px] text-gray-700 leading-6">
                  儿子，最近工作忙吗？
                </p>
              </div>
            </div>

            {/* 用户回复 */}
            <div className="flex gap-2 justify-end">
              <div className="bg-tianqing/90 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[180px]">
                <p className="text-[12px] text-white leading-6">
                  还好，妈不用担心
                </p>
              </div>
            </div>

            {/* 妈妈追问 */}
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-[9px] text-rose-600 font-medium flex-shrink-0">
                妈
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-gray-100 max-w-[180px]">
                <p className="text-[12px] text-gray-700 leading-6">
                  上次吵架的事，妈妈想跟你道歉，但不知道怎么说
                </p>
              </div>
            </div>

            {/* 用户不知道怎么回 */}
            <div className="flex gap-2 justify-end">
              <div className="bg-gray-200 rounded-2xl px-4 py-2.5 max-w-[120px]">
                <p className="text-[12px] text-gray-400 leading-6">正在输入...</p>
              </div>
            </div>
          </div>

          {/* 内心 OS */}
          <div className="mt-5 pt-4 border-t border-rose-100/50">
            <p className="text-[11px] text-gray-400 leading-6 italic">
              "其实我想说：妈，我也有不对的地方。但不知道怎么开口..."
            </p>
          </div>
        </div>
      </div>

      {/* 金句 */}
      <div className="text-center py-3">
        <p className="text-base text-gray-700 leading-8 font-light">
          中国有 <span className="text-tianqing font-medium">4.94 亿</span> 个家庭
        </p>
        <p className="text-sm text-gray-500 leading-7">
          很多话，当面说不出口
        </p>
        <p className="text-sm text-gray-500 leading-7">
          发微信，又太轻
        </p>
      </div>
    </div>
  );
}

// ---------- 场景 2：解决方案 ----------
function Scene2() {
  return (
    <div className="space-y-5">
      {/* 金句 */}
      <div className="text-center py-4">
        <p className="text-xl text-gray-700 leading-8 font-light">
          我们做了一件事——
        </p>
        <p className="text-xl text-tianqing font-medium mt-2 tracking-wider">
          把说不出口的话
        </p>
        <p className="text-xl text-gray-700 font-light mt-1">
          轻轻放在桌面上
        </p>
      </div>

      {/* 核心价值 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/80 rounded-2xl p-4 text-center border border-white/60 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-tianqing/10 flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#A3B8C6" strokeWidth="1.5" />
              <path d="M8 14 Q10 12 12 14 T16 14" stroke="#A3B8C6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">零层级触达</p>
        </div>

        <div className="bg-white/80 rounded-2xl p-4 text-center border border-white/60 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-oupink/10 flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 4 C8 4 5 8 5 12c0 3 2 5 4 6" stroke="#C9A8A8" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 4 c4 0 7 4 7 8c0 3-2 5-4 6" stroke="#C9A8A8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">含蓄表达</p>
        </div>

        <div className="bg-white/80 rounded-2xl p-4 text-center border border-white/60 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-yuebai flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="10" width="12" height="8" rx="1.5" stroke="#7A93A4" strokeWidth="1.5" />
              <path d="M6 11 L12 15 L18 11" stroke="#7A93A4" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">家人互联</p>
        </div>
      </div>

      {/* 技术亮点 */}
      <div className="bg-gradient-to-r from-tianqing/5 via-oupink/5 to-tianqing/5 rounded-2xl p-4 border border-tianqing/10">
        <p className="text-xs text-tianqing text-center tracking-[0.32em] mb-2">
          VIVO · 原子组件
        </p>
        <p className="text-sm text-gray-700 text-center leading-6">
          基于 VIVO OriginOS 原子组件生态
        </p>
        <p className="text-xs text-gray-500 text-center leading-5 mt-1">
          把情感传递，融入手机桌面的第一屏
        </p>
      </div>
    </div>
  );
}

// ---------- 场景 3：产品演示 ----------
function Scene3() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-tianqing text-center tracking-[0.32em]">
        三 件 温 柔 的 挂 件
      </p>

      {/* 三个组件 */}
      <div className="space-y-4">
        {/* 心湖 */}
        <div className="bg-white/80 rounded-2xl p-4 border border-white/60 shadow-soft">
          <div className="flex gap-4 items-start">
            <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden flex-shrink-0 shadow-inner"
              style={{ background: "radial-gradient(135deg, #E6D5D5 0%, #F5F1ED 45%, #A3B8C6 100%)" }}>
              <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-2">
                <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="26" stroke="white" strokeWidth="2" opacity="0.8" />
                  <path d="M14 32 Q20 28 28 32 T42 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
                <p className="text-[8px] opacity-80 mt-1">今日·家</p>
                <p className="text-sm font-light">静好</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700">心湖</h4>
                <span className="text-[9px] px-1.5 py-0.5 bg-tianqing/10 text-tianqing rounded">2×2</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-5">
                家庭情绪晴雨表<br />
                <span className="text-gray-400">一眼看到家人的心绪</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                "妈妈今天有点低落，轻轻问候一下"
              </p>
            </div>
          </div>
        </div>

        {/* 心意 */}
        <div className="bg-white/80 rounded-2xl p-4 border border-white/60 shadow-soft">
          <div className="flex gap-4 items-start">
            <div className="w-[120px] h-[64px] rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-gradient-to-br from-rose-50/90 via-oupink/30 to-oupink/50">
              <div className="w-full h-full p-2.5 flex flex-col justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-white/70 flex items-center justify-center text-[7px] text-gray-600">妈</div>
                  <span className="text-[8px] text-gray-700">妈妈</span>
                  <span className="text-[7px] text-gray-400">·刚刚</span>
                  <div className="ml-auto w-1 h-1 rounded-full bg-rose-400" />
                </div>
                <p className="text-[9px] text-gray-700 leading-tight font-light">
                  "今天看到一束很好看的花"
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700">心意</h4>
                <span className="text-[9px] px-1.5 py-0.5 bg-oupink/15 text-oupink rounded">4×2</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-5">
                桌面上的家书<br />
                <span className="text-gray-400">一抬眼就看到家人的消息</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                "不需要打开App，桌面就能看到"
              </p>
            </div>
          </div>
        </div>

        {/* 写一句 */}
        <div className="bg-white/80 rounded-2xl p-4 border border-white/60 shadow-soft">
          <div className="flex gap-4 items-start">
            <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-gradient-to-br from-yuebai via-mibai to-tianqing/20">
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                <svg width="28" height="28" viewBox="0 0 76 76" fill="none">
                  <rect x="14" y="22" width="48" height="34" rx="3" fill="white" stroke="#7A93A4" strokeWidth="2" />
                  <path d="M14 25 L38 42 L62 25" stroke="#7A93A4" strokeWidth="2" fill="none" />
                  <path d="M52 16 C50 12, 44 12, 44 17 C44 12, 38 12, 36 16 C34 20, 40 24, 44 28 C48 24, 54 20, 52 16 Z" fill="#E6D5D5" />
                </svg>
                <p className="text-[8px] text-tianqing/70 mt-1">安语</p>
                <p className="text-sm text-gray-700 font-light">写一句</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700">写一句</h4>
                <span className="text-[9px] px-1.5 py-0.5 bg-yuebai text-gray-500 rounded">2×2</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-5">
                桌面上的传话筒<br />
                <span className="text-gray-400">一触即达，写下想说的话</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                "今晚想说点什么？"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 核心金句 */}
      <div className="bg-gradient-to-r from-tianqing/5 to-oupink/5 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-700 leading-7">
          <span className="text-tianqing">不用打开App</span><br />
          只需要抬头看一眼
        </p>
        <p className="text-xs text-gray-500 mt-2">
          原子组件，让情感传递零层级
        </p>
      </div>
    </div>
  );
}

// ---------- 场景 4：情感升华 ----------
function Scene4() {
  const testimonials = [
    { who: "妈妈", text: "吵架后一直不知道怎么开口道歉，在心湖里写了一句，现在心里轻松多了" },
    { who: "儿子", text: "工作压力大不敢跟家里说，现在每天写一条，发给妈妈看，她也放心了" },
    { who: "爸爸", text: "五十多岁了不太会打字，但桌面上的组件很简单，我也能跟孩子交流了" },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-tianqing text-center tracking-[0.32em]">
        真 实 的 使 用 故 事
      </p>

      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white/80 rounded-2xl p-4 border border-white/60 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tianqing/30 to-oupink/30 flex items-center justify-center text-[10px] text-gray-600 font-medium flex-shrink-0">
                {t.who.slice(0, 1)}
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 mb-1">{t.who} · 用户访谈</p>
                <p className="text-sm text-gray-700 leading-6 font-light">
                  "{t.text}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 金句 */}
      <div className="text-center py-5 border-t border-tianqing/10">
        <p className="text-base text-gray-700 leading-8">
          家的温度<br />
          <span className="text-tianqing font-medium">不需要大声说出来</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          有时候，一句话就够了
        </p>
      </div>
    </div>
  );
}

// ---------- 场景 5：收尾 ----------
function Scene5() {
  return (
    <div className="space-y-6 text-center">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-tianqing/20 to-oupink/20 flex items-center justify-center shadow-inner">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#7A93A4" strokeWidth="1.5" />
            <path d="M10 18 Q13 16 16 18 T22 18" stroke="#7A93A4" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="12" r="2" fill="#C9A8A8" />
          </svg>
        </div>
      </div>

      {/* Slogan */}
      <div>
        <h2 className="text-2xl font-light text-gray-700 tracking-wider">
          安 语
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          把说不出口的话<br />
          温柔地传出去
        </p>
      </div>

      {/* 团队 */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          「安语」东方家庭情感传递
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          基于 VIVO OriginOS 原子组件生态
        </p>
      </div>

      {/* 技术栈 */}
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-[10px] px-2 py-1 bg-tianqing/10 text-tianqing rounded-full">Next.js 14</span>
        <span className="text-[10px] px-2 py-1 bg-oupink/10 text-oupink rounded-full">React 18</span>
        <span className="text-[10px] px-2 py-1 bg-yuebai text-gray-500 rounded-full">VIVO 原子组件</span>
        <span className="text-[10px] px-2 py-1 bg-yuebai text-gray-500 rounded-full">TypeScript</span>
        <span className="text-[10px] px-2 py-1 bg-yuebai text-gray-500 rounded-full">东方美学设计</span>
      </div>
    </div>
  );
}

// ---------- 主页面 ----------
const chapters: { id: string; title: string; component: React.ReactNode }[] = [
  { id: "open", title: "开场", component: <Scene1 /> },
  { id: "solution", title: "方案", component: <Scene2 /> },
  { id: "product", title: "产品", component: <Scene3 /> },
  { id: "story", title: "故事", component: <Scene4 /> },
  { id: "end", title: "结尾", component: <Scene5 /> },
];

export default function PitchDeckPage() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-mibai via-yuebai to-oupink/10">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-mibai/80 backdrop-blur-md border-b border-tianqing/10 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-tianqing tracking-[0.32em]">ANYU</span>
            <span className="text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">比赛路演</span>
          </div>
          <div className="flex gap-1">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setCurrent(i)}
                className={`px-2 py-1 rounded-full text-[10px] transition-all ${
                  i === current
                    ? "bg-tianqing text-white"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 内容区 */}
      <div className="px-5 py-6">
        {/* 章节标题 */}
        <div className="mb-5">
          <p className="text-[10px] text-gray-400 tracking-[0.32em]">
            {String(current + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
          </p>
          <h1 className="text-lg font-semibold text-gray-700 mt-1">
            {chapters[current].title}
          </h1>
        </div>

        {/* 章节内容 */}
        <div className="pb-20">
          {chapters[current].component}
        </div>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-mibai/80 backdrop-blur-md border-t border-tianqing/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              current === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ← 上一页
          </button>

          {/* 进度条 */}
          <div className="flex gap-1.5">
            {chapters.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? "bg-tianqing w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent(Math.min(chapters.length - 1, current + 1))}
            disabled={current === chapters.length - 1}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              current === chapters.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-tianqing hover:bg-tianqing/10"
            }`}
          >
            下一页 →
          </button>
        </div>
      </div>
    </div>
  );
}
