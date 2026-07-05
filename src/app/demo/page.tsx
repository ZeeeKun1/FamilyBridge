"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Icon, { IconNames } from "@/components/shared/Icon";

// ============================================================
// 路演 Demo — 沉浸式自动演示（150秒）
// 场景：登录 → 首页 → 写一条 → 切父母端 → 桌面通知弹窗 →
//       父母首页 → 收件箱 → 心动+回信 → 桌面通知 → 孩子端验证
// ============================================================

interface DemoPhase {
  id: string;
  label: string;
  route: string;
  duration: number; // ms
}

const PHASES: DemoPhase[] = [
  { id: "login-child", label: "登录孩子端", route: "/", duration: 7000 },
  { id: "child-home", label: "首页展示", route: "/", duration: 13000 },
  { id: "write-imagery", label: "选择意象", route: "/bottle", duration: 18000 },
  { id: "write-preview", label: "预览发送", route: "/bottle", duration: 15000 },
  { id: "child-sent", label: "回到首页", route: "/", duration: 10000 },
  { id: "switch-parent", label: "切换父母端", route: "/", duration: 10000 },
  { id: "notification-parent", label: "桌面通知", route: "/", duration: 10000 },
  { id: "parent-home", label: "父母首页", route: "/", duration: 14000 },
  { id: "parent-inbox", label: "查看家书", route: "/inbox", duration: 14000 },
  { id: "parent-reply", label: "心动+回信", route: "/inbox", duration: 10000 },
  { id: "notification-child", label: "收到回信通知", route: "/", duration: 10000 },
  { id: "child-verify", label: "验证回执", route: "/", duration: 10000 },
  { id: "ending", label: "结束", route: "/", duration: 8000 },
];

const TOTAL_DURATION = PHASES.reduce((sum, p) => sum + p.duration, 0);

// ============================================================
// 桌面通知弹窗组件（模拟 VIVO 原子组件通知）
// ============================================================
function DesktopNotification({
  visible,
  title,
  body,
  icon,
  onClose,
}: {
  visible: boolean;
  title: string;
  body: string;
  icon: string;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (visible) {
      // 延迟 300ms 后弹入
      const t1 = setTimeout(() => setShow(true), 300);
      // 自动 6 秒后消失
      const t2 = setTimeout(() => {
        setHiding(true);
        setTimeout(() => {
          setShow(false);
          setHiding(false);
          onClose();
        }, 500);
      }, 6000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setShow(false);
      setHiding(false);
    }
  }, [visible, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12%] pointer-events-none"
      style={{ backdropFilter: "blur(2px)", backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div
        className={`bg-white/95 rounded-2xl shadow-2xl w-[280px] overflow-hidden pointer-events-auto transition-all duration-500 ${
          hiding
            ? "opacity-0 translate-y-[-20px] scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{ animation: !hiding ? "notificationSlideIn 0.5s ease-out" : undefined }}
      >
        {/* 顶部图标区 */}
        <div className="bg-gradient-to-r from-[#A3B8C6] to-[#E6D5D5] px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
            <Icon name={icon as any} size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{title}</p>
            <p className="text-[11px] text-white/70">安语</p>
          </div>
          <div className="text-[10px] text-white/60">刚刚</div>
        </div>
        {/* 内容 */}
        <div className="px-4 py-3">
          <p className="text-[13px] text-gray-700 leading-relaxed">{body}</p>
        </div>
        {/* 底部操作 */}
        <div className="border-t border-gray-100 flex">
          <button className="flex-1 py-2.5 text-[13px] text-[#A3B8C6] font-medium active:bg-gray-50 transition-colors">
            查看
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[13px] text-gray-400 active:bg-gray-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 滚动辅助
// ============================================================
function useAutoScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    let scrollTimeout: NodeJS.Timeout;
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const smoothScroll = () => {
      const el = scrollContainer as HTMLElement;
      const maxScroll = el.scrollHeight - el.clientHeight;
      // 300ms 内滚动一点
      const step = 80 + Math.random() * 120;
      if (el.scrollTop < maxScroll) {
        el.scrollBy({ top: step, behavior: "smooth" });
        scrollTimeout = setTimeout(smoothScroll, 1200 + Math.random() * 800);
      } else {
        // 到底了，等一会再滚回顶部
        scrollTimeout = setTimeout(() => {
          el.scrollTo({ top: 0, behavior: "smooth" });
          scrollTimeout = setTimeout(smoothScroll, 2000);
        }, 3000);
      }
    };

    scrollTimeout = setTimeout(smoothScroll, 1500);
    return () => clearTimeout(scrollTimeout);
  }, [active]);
}

// ============================================================
// 主页面
// ============================================================
export default function DemoPage() {
  const router = useRouter();
  const store = useStore();
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notification, setNotification] = useState<{
    visible: boolean;
    title: string;
    body: string;
    icon: string;
  }>({ visible: false, title: "", body: "", icon: IconNames.LETTER });

  const bottleIdRef = useRef<string>("");
  const startRef = useRef<number>(0);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const updateStep = useCallback((index: number) => {
    setPhaseIndex(index);
  }, []);

  const navigate = useCallback(
    async (path: string, wait = 2000) => {
      router.push(path);
      await delay(wait);
    },
    [router]
  );

  const showNotification = useCallback(
    (title: string, body: string, icon: string) =>
      new Promise<void>((resolve) => {
        setNotification({ visible: true, title, body, icon });
        const t = setTimeout(() => {
          setNotification((prev) => ({ ...prev, visible: false }));
          resolve();
        }, 7000);
        return () => clearTimeout(t);
      }),
    []
  );

  // 滚动控制
  const [shouldScroll, setShouldScroll] = useState(false);
  useAutoScroll(shouldScroll);

  // 进度条计时
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning]);

  // ============================================================
  // 核心：运行演示
  // ============================================================
  const runDemo = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setElapsed(0);
    startRef.current = Date.now();
    setShouldScroll(false);
    store.logout();
    await delay(500);

    try {
      // ---- Phase 0: 登录孩子端 ----
      updateStep(0);
      await delay(2000);
      const ok1 = store.login("child", "1234");
      if (!ok1) throw new Error("登录孩子端失败");
      await store.loadDriftBottles();
      await navigate("/", 3000);
      setShouldScroll(true);

      // ---- Phase 1: 孩子端首页 ----
      updateStep(1);
      await delay(PHASES[1].duration);
      setShouldScroll(false);

      // ---- Phase 2: 写一条 - 意象选择 ----
      updateStep(2);
      await navigate("/bottle", 2000);
      setShouldScroll(true);
      await delay(PHASES[2].duration);
      setShouldScroll(false);

      // ---- Phase 3: 确认+预览+发送 ----
      updateStep(3);
      // 编程式发送一封家书
      await store.sendDriftBottle({
        senderId: "member_child_01",
        receiverId: "member_mom_01",
        imageryId: "1",
        imageryName: "一盏暖灯",
        poem: "你回家的路上，我给你点了一盏灯。\n不催，不问，只是亮着。",
        mode: "imagery",
        status: "sent",
        sentAt: Date.now(),
      });
      await delay(PHASES[3].duration);

      // ---- Phase 4: 回到首页 ----
      updateStep(4);
      await navigate("/", 2000);
      await store.loadDriftBottles();
      setShouldScroll(true);
      await delay(PHASES[4].duration);
      setShouldScroll(false);

      // ---- Phase 5: 切换到父母端 ----
      updateStep(5);
      store.logout();
      await delay(1500);
      const ok2 = store.login("parent", "1234");
      if (!ok2) throw new Error("登录父母端失败");
      await store.loadDriftBottles();
      await navigate("/", 2000);
      await delay(PHASES[5].duration);

      // ---- Phase 6: 桌面通知弹窗（父母端收到家书）----
      updateStep(6);
      await showNotification(
        "安语 · 心意",
        "孩子给你寄了一盏暖灯，点击桌面组件查看",
        IconNames.LAMP
      );
      await delay(PHASES[6].duration);

      // ---- Phase 7: 父母端首页 ----
      updateStep(7);
      setShouldScroll(true);
      await delay(PHASES[7].duration);
      setShouldScroll(false);

      // ---- Phase 8: 收件箱 ----
      updateStep(8);
      await navigate("/inbox", 2000);
      // 找到刚收到的家书
      const received = [...store.driftBottles]
        .filter((b) => b.receiverId === "member_mom_01" && b.status === "sent")
        .sort((a, b) => b.sentAt - a.sentAt);
      if (received.length > 0) {
        bottleIdRef.current = received[0].id;
        await store.openDriftBottle(received[0].id);
        await store.loadDriftBottles();
      }
      await delay(PHASES[8].duration);

      // ---- Phase 9: 心动+回信 ----
      updateStep(9);
      if (bottleIdRef.current) {
        await store.reactToDriftBottle(bottleIdRef.current, "heart");
        await store.loadDriftBottles();
        // 模拟父母回信
        await store.sendDriftBottle({
          senderId: "member_mom_01",
          receiverId: "member_child_01",
          imageryId: "2",
          imageryName: "一杯热茶",
          poem: "天冷了，喝杯热茶暖暖手。\n路上小心，到了说一声。",
          mode: "imagery",
          status: "sent",
          sentAt: Date.now(),
        });
        await store.loadDriftBottles();
      }
      await delay(PHASES[9].duration);

      // ---- Phase 10: 切回孩子端 + 收到回信通知 ----
      updateStep(10);
      store.logout();
      await delay(1500);
      const ok3 = store.login("child", "1234");
      if (!ok3) throw new Error("切回孩子端失败");
      await store.loadDriftBottles();
      await navigate("/", 2000);
      // 桌面通知
      await showNotification(
        "安语 · 心意",
        "妈妈回你了一杯热茶：路上小心，到了说一声",
        IconNames.TEA
      );
      await delay(PHASES[10].duration);

      // ---- Phase 11: 孩子端验证 ----
      updateStep(11);
      await store.loadDriftBottles();
      setShouldScroll(true);
      await delay(PHASES[11].duration);
      setShouldScroll(false);

      // ---- Phase 12: 结束 ----
      updateStep(12);
      await delay(PHASES[12].duration);
    } catch {
      // ignore errors in demo
    } finally {
      setIsRunning(false);
      setPhaseIndex(-1);
      setShouldScroll(false);
      setNotification((prev) => ({ ...prev, visible: false }));
    }
  }, [isRunning, store, navigate, showNotification, updateStep]);

  // 计算进度
  const progress = isRunning ? Math.min(elapsed / TOTAL_DURATION, 1) : 0;
  const currentPhase = phaseIndex >= 0 && phaseIndex < PHASES.length ? PHASES[phaseIndex] : null;

  // 格式化时间
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* 全局通知弹窗 */}
      <DesktopNotification
        visible={notification.visible}
        title={notification.title}
        body={notification.body}
        icon={notification.icon}
        onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      />

      {/* 沉浸式演示控制面板 - 覆盖在 PhoneFrame 之上 */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        {/* 顶部信息栏 */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent p-3 pointer-events-auto">
          <div className="flex items-center justify-between max-w-[600px] mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/90 text-[11px] font-medium tracking-wide">
                {isRunning ? `REC ${formatTime(elapsed)}` : "STANDBY"}
              </span>
            </div>
            <span className="text-white/70 text-[10px] tracking-widest">
              {currentPhase ? currentPhase.label : "安语 Demo"}
            </span>
            <span className="text-white/70 text-[11px]">
              {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
            </span>
          </div>

          {/* 进度条 */}
          <div className="mt-2 max-w-[600px] mx-auto h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A3B8C6] to-[#E6D5D5] rounded-full transition-all duration-300 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* 步骤指示器 */}
          {isRunning && (
            <div className="mt-2 max-w-[600px] mx-auto">
              <div className="flex items-center gap-1 justify-center">
                {PHASES.map((phase, i) => (
                  <div
                    key={phase.id}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i < phaseIndex
                        ? "bg-[#A3B8C6]"
                        : i === phaseIndex
                          ? "bg-[#E6D5D5] scale-125"
                          : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部控制栏 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="max-w-[320px] mx-auto">
            <button
              onClick={runDemo}
              disabled={isRunning}
              className={`w-full py-3 rounded-2xl text-[13px] font-medium transition-all shadow-lg backdrop-blur-sm ${
                isRunning
                  ? "bg-white/20 text-white/60"
                  : "bg-white/90 text-gray-700 hover:bg-white active:scale-[0.98]"
              }`}
            >
              {isRunning ? `演示中... ${formatTime(elapsed)}` : "开始自动演示 (2:30)"}
            </button>
          </div>
        </div>
      </div>

      {/* 演示说明浮窗（非运行时显示） */}
      {!isRunning && phaseIndex < 0 && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#FDFBF8] rounded-3xl p-6 max-w-[320px] w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A3B8C6] to-[#E6D5D5] flex items-center justify-center">
                <Icon name={IconNames.LETTER} size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-gray-700">路演 Demo</h2>
                <p className="text-[10px] text-gray-400">安语 · 2分30秒自动演示</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {[
                "登录孩子端，展示意象选择与发送",
                "自动切换父母端，桌面弹窗通知",
                "查看家书，心动回执，回信",
                "切回孩子端，收到回信通知",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#A3B8C6]/10 flex items-center justify-center">
                    <span className="text-[10px] text-[#A3B8C6] font-medium">{i + 1}</span>
                  </div>
                  <span className="text-[12px] text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={runDemo}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#A3B8C6] to-[#E6D5D5] text-white text-[14px] font-medium shadow-md active:scale-[0.98] transition-transform"
            >
              开始演示
            </button>

            <p className="text-[9px] text-gray-300 text-center mt-3 tracking-widest">
              点击后将自动操作 13 个场景，无需手动干预
            </p>
          </div>
        </div>
      )}
    </>
  );
}
