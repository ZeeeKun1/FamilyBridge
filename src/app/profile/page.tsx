"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import Icon, { IconNames } from "@/components/shared/Icon";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const {
    userProfile,
    loadUserProfile,
    driftBottles,
    loadDriftBottles,
    timeCapsules,
    loadTimeCapsules,
    isLoading,
    currentMember,
    partnerMember,
    logout,
    setUserType,
    getTimelineStats,
  } = useStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadUserProfile();
      loadDriftBottles();
      loadTimeCapsules();
    }
  }, [loadUserProfile, loadDriftBottles, loadTimeCapsules]);

  const isParent = currentMember?.role === "parent";

  const stats = useMemo(() => getTimelineStats(), [driftBottles, getTimelineStats]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // 调试入口：连点 5 次"我的" 标题可切换身份（避免暴露给真实用户）
  const tapCountRef = useRef(0);
  const handleDebugTap = () => {
    tapCountRef.current += 1;
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      setUserType(isParent ? "child" : "parent");
    }
  };

  // 主线 + 次要功能入口（父母端隐藏树洞）
  const childMenuItems = [
    { id: "bottle", label: "写一条", icon: IconNames.LETTER, count: 0 },
    { id: "capsule", label: "时光胶囊", icon: IconNames.CAPSULE, count: timeCapsules.length },
    { id: "translate", label: "贴心翻译", icon: IconNames.WIND, count: 0 },
    { id: "treehole", label: "思绪森林", icon: IconNames.TREEHOLE, count: userProfile?.conflictFrequency || 0 },
  ];

  const parentMenuItems = [
    { id: "bottle", label: "写一条", icon: IconNames.LETTER, count: 0 },
    { id: "capsule", label: "时光胶囊", icon: IconNames.CAPSULE, count: timeCapsules.length },
    { id: "translate", label: "贴心翻译", icon: IconNames.WIND, count: 0 },
  ];

  const menuItems = isParent ? parentMenuItems : childMenuItems;

  return (
    <div className="flex flex-col bg-gradient-to-b from-mibai via-yuebai to-oupink/5">
      <header className="px-5 py-5">
        <h1
          onClick={handleDebugTap}
          className="font-semibold text-lg text-gray-700 select-none"
        >
          我的
        </h1>
      </header>

      <div className="flex-1 px-5 overflow-y-auto">
        {isLoading && <Loading text="加载中..." />}

        {!isLoading && (
          <>
            {/* 当前账号卡 */}
            <div
              className={`rounded-3xl p-6 text-white mb-5 shadow-md ${
                isParent
                  ? "bg-gradient-to-br from-oupink to-rose-400/80"
                  : "bg-gradient-to-br from-tianqing to-blue-400/70"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-medium">
                  {currentMember?.displayName?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {currentMember?.displayName || "未登录"}
                  </h2>
                  <p className="text-xs text-white/80 mt-1 tracking-wider">
                    {isParent ? "父母端 · 接收家书" : "孩子端 · 含蓄表达"}
                  </p>
                </div>
              </div>
              {partnerMember && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-[11px] text-white/70 tracking-widest mb-2">家庭成员</p>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-xs font-medium">
                      {partnerMember.displayName.charAt(0)}
                    </span>
                    <span className="text-sm">{partnerMember.displayName}</span>
                    <span className="text-[10px] text-white/60 ml-1">{partnerMember.relation}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 数据统计 */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <StatCard value={stats.totalMessages} label="家书总数" tone="tianqing" />
              <StatCard value={stats.sentCount} label="已写" tone="oupink" />
              <StatCard value={stats.receivedCount} label="已收" tone="amber" />
            </div>

            {/* 快捷功能 */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/60 mb-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4 tracking-wide">快捷功能</h3>
              <div className={`grid ${menuItems.length === 4 ? "grid-cols-4" : "grid-cols-3"} gap-3`}>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => router.push(`/${item.id}`)}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yuebai to-mibai flex items-center justify-center shadow-inner">
                      <Icon name={item.icon} size={22} className="text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                    {item.count > 0 && (
                      <span className="text-[10px] text-tianqing font-medium">{item.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 设置项 */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 overflow-hidden mb-5">
              <SettingRow icon={IconNames.PROFILE} label="家庭成员" />
              <SettingRow icon={IconNames.SPARKLE} label="隐私设置" />
              <SettingRow icon={IconNames.SPRING} label="关于安语" />
            </div>

            {/* 退出登录 */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-white/70 backdrop-blur-md rounded-2xl py-3 text-sm text-rose-500 border border-rose-100 active:scale-[0.99] transition-transform"
            >
              退出登录
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-5 mb-4 tracking-widest">
              安 · 语 · 让爱无需言说
            </p>
          </>
        )}
      </div>

    </div>
  );
}

function StatCard({ value, label, tone }: { value: number; label: string; tone: "tianqing" | "oupink" | "amber" }) {
  const toneClass =
    tone === "tianqing" ? "text-tianqing" : tone === "oupink" ? "text-oupink" : "text-amber-500";
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 text-center">
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
      <p className="text-[11px] text-gray-400 mt-1 tracking-wider">{label}</p>
    </div>
  );
}

function SettingRow({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 last:border-b-0 active:bg-yuebai/40 transition-colors"
    >
      <div className="w-8 h-8 rounded-xl bg-yuebai/60 flex items-center justify-center">
        <Icon name={icon} size={16} className="text-gray-500" />
      </div>
      <span className="text-sm text-gray-700 flex-1 text-left">{label}</span>
      <span className="text-gray-300 text-sm">›</span>
    </button>
  );
}
