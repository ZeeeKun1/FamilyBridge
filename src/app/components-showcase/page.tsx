"use client";

import { useRouter } from "next/navigation";

// ============================================================
// VIVO 桌面组件预览页
// 展示心湖、心意、写一句三款桌面小组件
// ============================================================

/* ---------- 手机桌面模拟容器 ---------- */
function PhoneDesktop({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="relative">
      {/* 手机壳 */}
      <div className="w-[320px] rounded-[44px] bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-2 shadow-2xl">
        {/* 屏幕区域 */}
        <div className="w-full rounded-[36px] overflow-hidden bg-gradient-to-b from-[#0a0a12] to-[#12121f]">
          {/* 状态栏 */}
          <div className="flex items-center justify-between px-6 pt-3.5 pb-1 text-[10px] text-white/50">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 items-end">
                <div className="w-[3px] h-[6px] bg-white/40 rounded-sm" />
                <div className="w-[3px] h-[8px] bg-white/40 rounded-sm" />
                <div className="w-[3px] h-[10px] bg-white/40 rounded-sm" />
                <div className="w-[3px] h-[12px] bg-white/40 rounded-sm" />
              </div>
              <div className="w-5 h-[9px] border border-white/40 rounded-[2px] relative ml-1">
                <div
                  className="absolute inset-[2px] bg-white/40 rounded-[1px]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          </div>

          {/* 桌面壁纸区域 - 小组件展示 */}
          <div className="px-5 pt-3 pb-4 min-h-[420px] flex flex-col gap-3 items-start">
            {/* 壁纸纹理 - 深色渐变背景上的小组件 */}
            <div className="w-full h-full relative rounded-[28px] overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #0f1923 0%, #162233 40%, #1a2840 70%, #0f1923 100%)",
              }}
            >
              {/* 壁纸光晕 */}
              <div
                className="absolute top-10 right-6 w-32 h-32 rounded-full opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, #A3B8C6, transparent)" }}
              />
              <div
                className="absolute bottom-20 left-4 w-24 h-24 rounded-full opacity-15 blur-3xl"
                style={{ background: "radial-gradient(circle, #E6D5D5, transparent)" }}
              />

              {/* 桌面小组件区域 */}
              <div className="relative z-10 p-5 flex flex-col items-center gap-4">
                {/* 标签 */}
                {label && (
                  <div className="self-start mb-1">
                    <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">
                      {label}
                    </span>
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>

          {/* 底部 Dock */}
          <div className="px-8 pb-4 pt-1">
            <div className="flex items-center justify-center gap-5">
              {["#", "O", "O", "O"].map((icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[14px]"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, #A3B8C6, #8BA5B5)"
                      : "rgba(255,255,255,0.08)",
                    color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* 底部指示条 */}
          <div className="flex justify-center pb-2 pt-0.5">
            <div className="w-24 h-[4px] bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 心湖小组件 (2x2) ---------- */
function XinhuiWidget() {
  return (
    <div
      className="w-[130px] h-[130px] rounded-[22px] p-3 flex flex-col"
      style={{
        background: "rgba(163, 184, 198, 0.12)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(163, 184, 198, 0.15)",
      }}
    >
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-white/70 font-medium tracking-wider">
          心湖
        </span>
        <span
          className="text-[8px] px-1.5 py-0.5 rounded-full"
          style={{
            background: "rgba(163, 184, 198, 0.2)",
            color: "rgba(163, 184, 198, 0.8)",
          }}
        >
          2x2
        </span>
      </div>

      {/* 水波纹装饰 */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* 波纹圈 */}
        <div
          className="absolute w-16 h-16 rounded-full animate-breathing"
          style={{ border: "1px solid rgba(163, 184, 198, 0.15)" }}
        />
        <div
          className="absolute w-10 h-10 rounded-full"
          style={{
            border: "1px solid rgba(163, 184, 198, 0.25)",
            animation: "breathing 4s ease-in-out infinite 1s",
          }}
        />
        {/* 中心状态 */}
        <div
          className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(163, 184, 198, 0.3), rgba(230, 213, 213, 0.2))",
            boxShadow: "0 0 20px rgba(163, 184, 198, 0.2)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="rgba(230, 213, 213, 0.6)"
            />
          </svg>
        </div>
      </div>

      {/* 底部情绪标签 */}
      <div className="flex justify-center gap-1.5 mt-1">
        <span
          className="text-[7px] px-1 py-[1px] rounded-full"
          style={{
            background: "rgba(163, 184, 198, 0.25)",
            color: "rgba(163, 184, 198, 0.9)",
          }}
        >
          平静
        </span>
        <span
          className="text-[7px] px-1 py-[1px] rounded-full"
          style={{
            background: "rgba(230, 213, 213, 0.25)",
            color: "rgba(230, 213, 213, 0.9)",
          }}
        >
          温暖
        </span>
        <span
          className="text-[7px] px-1 py-[1px] rounded-full"
          style={{
            background: "rgba(163, 184, 198, 0.12)",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          心忧
        </span>
      </div>
    </div>
  );
}

/* ---------- 心意小组件 (4x2) ---------- */
function XinyiWidget() {
  return (
    <div
      className="w-[270px] h-[130px] rounded-[22px] p-3.5 flex flex-col"
      style={{
        background: "rgba(230, 213, 213, 0.10)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(230, 213, 213, 0.12)",
      }}
    >
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-white/70 font-medium tracking-wider">
          心意
        </span>
        <span
          className="text-[8px] px-1.5 py-0.5 rounded-full"
          style={{
            background: "rgba(230, 213, 213, 0.2)",
            color: "rgba(230, 213, 213, 0.8)",
          }}
        >
          4x2
        </span>
      </div>

      {/* 信件预览 */}
      <div
        className="flex-1 rounded-[14px] p-2.5 flex flex-col justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(163, 184, 198, 0.08), rgba(230, 213, 213, 0.08))",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* 发送者 */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[7px]"
            style={{
              background: "rgba(163, 184, 198, 0.25)",
              color: "rgba(163, 184, 198, 0.9)",
            }}
          >
            语
          </div>
          <span className="text-[8px] text-white/50">小语</span>
          <span className="text-[7px] text-white/25 ml-auto">3分钟前</span>
        </div>

        {/* 信件内容 */}
        <p className="text-[9px] text-white/45 leading-relaxed font-song mt-1">
          妈，刚加完班看到你的消息，心里暖暖的。周末一定回去吃饭。
        </p>

        {/* 底部操作 */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="rgba(230, 165, 165, 0.6)"
              />
            </svg>
            <span className="text-[7px] text-white/30">妈妈已心动</span>
          </div>
          <span className="text-[7px] text-white/25">1封待启</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 写一句小组件 (2x2) ---------- */
function XieyijuWidget() {
  return (
    <div
      className="w-[130px] h-[130px] rounded-[22px] p-3 flex flex-col items-center justify-center"
      style={{
        background: "rgba(163, 184, 198, 0.08)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(163, 184, 198, 0.12)",
      }}
    >
      {/* 标题 */}
      <div className="flex items-center gap-1 mb-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
            stroke="rgba(163, 184, 198, 0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.06 7.94l3.75 3.75"
            stroke="rgba(163, 184, 198, 0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] text-white/60 tracking-wider font-medium">
          写一句
        </span>
      </div>

      {/* 写按钮 */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center animate-breathing"
        style={{
          background: "linear-gradient(135deg, rgba(163, 184, 198, 0.3), rgba(230, 213, 213, 0.25))",
          boxShadow: "0 0 25px rgba(163, 184, 198, 0.15)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 底部提示 */}
      <span className="text-[7px] text-white/25 mt-2">点此记录心情</span>

      {/* 尺寸标签 - 右上角 */}
      <span
        className="absolute top-2.5 right-2.5 text-[7px] px-1 py-[1px] rounded-full"
        style={{
          background: "rgba(163, 184, 198, 0.15)",
          color: "rgba(163, 184, 198, 0.7)",
        }}
      >
        2x2
      </span>
    </div>
  );
}

/* ---------- 组件详情卡片 ---------- */
function WidgetDetailCard({
  name,
  nameEn,
  size,
  description,
  mockup,
  color,
}: {
  name: string;
  nameEn: string;
  size: string;
  description: string;
  mockup: React.ReactNode;
  color: "tianqing" | "oupink";
}) {
  const colorMap = {
    tianqing: {
      bg: "rgba(163, 184, 198, 0.06)",
      border: "rgba(163, 184, 198, 0.12)",
      accent: "#A3B8C6",
      accentBg: "rgba(163, 184, 198, 0.1)",
      tag: "bg-tianqing/10 text-tianqing",
    },
    oupink: {
      bg: "rgba(230, 213, 213, 0.06)",
      border: "rgba(230, 213, 213, 0.12)",
      accent: "#E6D5D5",
      accentBg: "rgba(230, 213, 213, 0.1)",
      tag: "bg-oupink/10 text-oupink",
    },
  };

  const c = colorMap[color];

  return (
    <div className="rounded-3xl bg-mibai p-6 shadow-soft card-hover">
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-700 tracking-wider">
              {name}
            </h2>
            <span className="text-xs text-gray-400 font-song italic">
              {nameEn}
            </span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <span
          className="text-[11px] px-3 py-1 rounded-full tracking-wider flex-shrink-0"
          style={{
            background: c.accentBg,
            color: c.accent,
            border: `1px solid ${c.border}`,
          }}
        >
          {size}
        </span>
      </div>

      {/* 组件预览 - 居中展示 */}
      <div className="flex justify-center">
        {mockup}
      </div>
    </div>
  );
}

/* ---------- 页面主体 ---------- */
export default function ComponentsShowcasePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-mibai">
      {/* 顶部导航 */}
      <div className="px-5 pt-5 pb-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span className="tracking-wider">返回</span>
        </button>
      </div>

      {/* 页面标题 */}
      <div className="px-5 pt-4 pb-8 text-center">
        <p className="text-[10px] text-gray-400 tracking-[0.4em] mb-3">
          VIVO WIDGETS
        </p>
        <h1 className="text-2xl font-semibold text-gray-700 tracking-wider">
          桌面组件预览
        </h1>
        <p className="text-sm text-gray-400 mt-3 leading-7 font-song max-w-xs mx-auto">
          将安语的温暖放上桌面，每一次点亮屏幕，都能感受到家人的心意
        </p>
      </div>

      {/* 组件列表 */}
      <div className="px-5 pb-20 space-y-8">
        {/* 心湖 */}
        <WidgetDetailCard
          name="心湖"
          nameEn="xinhui"
          size="2x2"
          description="家庭情绪晴雨表，一眼看见家人的心情"
          color="tianqing"
          mockup={
            <PhoneDesktop label="心湖 · 2x2 桌面组件">
              <div className="flex flex-col items-center gap-3 w-full">
                {/* 时间显示 */}
                <span className="text-[11px] text-white/20 self-start tracking-wider">
                  12:30
                </span>

                {/* 小组件本体 */}
                <XinhuiWidget />

                {/* 情绪状态说明 */}
                <div className="w-full mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-3 rounded-full" style={{ background: "#A3B8C6" }} />
                    <span className="text-[8px] text-white/25 tracking-wider">
                      情绪状态
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: "平静", active: true, dot: "#A3B8C6" },
                      { label: "温暖", active: false, dot: "#E6D5D5" },
                      { label: "心忧", active: false, dot: "#7A93A4" },
                      { label: "待记录", active: false, dot: "rgba(255,255,255,0.15)" },
                    ].map((state) => (
                      <div
                        key={state.label}
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                          background: state.active
                            ? `${state.dot}20`
                            : "rgba(255,255,255,0.03)",
                          border: state.active
                            ? `1px solid ${state.dot}30`
                            : "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: state.dot,
                            opacity: state.active ? 1 : 0.3,
                          }}
                        />
                        <span
                          className="text-[7px]"
                          style={{
                            color: state.active
                              ? `${state.dot}cc`
                              : "rgba(255,255,255,0.25)",
                          }}
                        >
                          {state.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PhoneDesktop>
          }
        />

        {/* 心意 */}
        <WidgetDetailCard
          name="心意"
          nameEn="xinyi"
          description="桌面家书展示，收到的爱意一目了然"
          size="4x2"
          color="oupink"
          mockup={
            <PhoneDesktop label="心意 · 4x2 桌面组件">
              <div className="flex flex-col items-center gap-3 w-full">
                {/* 时间显示 */}
                <span className="text-[11px] text-white/20 self-start tracking-wider">
                  12:30
                </span>

                {/* 小组件本体 */}
                <XinyiWidget />

                {/* 说明 */}
                <div className="w-full mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full" style={{ background: "#E6D5D5" }} />
                    <span className="text-[8px] text-white/25 tracking-wider">
                      最新家书预览
                    </span>
                  </div>
                </div>
              </div>
            </PhoneDesktop>
          }
        />

        {/* 写一句 */}
        <WidgetDetailCard
          name="写一句"
          nameEn="xieyiju"
          description="快速记录，桌面直达，灵感不再溜走"
          size="2x2"
          color="tianqing"
          mockup={
            <PhoneDesktop label="写一句 · 2x2 桌面组件">
              <div className="flex flex-col items-center gap-3 w-full">
                {/* 时间显示 */}
                <span className="text-[11px] text-white/20 self-start tracking-wider">
                  12:30
                </span>

                {/* 小组件本体 */}
                <div className="relative">
                  <XieyijuWidget />
                </div>

                {/* 说明 */}
                <div className="w-full mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full" style={{ background: "#A3B8C6" }} />
                    <span className="text-[8px] text-white/25 tracking-wider">
                      一键写下此刻心意
                    </span>
                  </div>
                </div>
              </div>
            </PhoneDesktop>
          }
        />
      </div>

      {/* 底部装饰 */}
      <div className="text-center pb-12 px-5">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-tianqing/20" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#E6D5D5"
              opacity="0.4"
            />
          </svg>
          <div className="w-8 h-px bg-oupink/20" />
        </div>
        <p className="text-xs text-gray-400 font-song leading-6">
          三个小组件，三种温暖的连接方式
        </p>
      </div>
    </div>
  );
}
