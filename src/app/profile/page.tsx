"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import Loading from "@/components/shared/Loading";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const {
    userProfile,
    loadUserProfile,
    parentProfiles,
    loadParentProfiles,
    driftBottles,
    loadDriftBottles,
    timeCapsules,
    loadTimeCapsules,
    isLoading,
    userType,
    setUserType,
  } = useStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadUserProfile();
      loadParentProfiles();
      loadDriftBottles();
      loadTimeCapsules();
    }
  }, [loadUserProfile, loadParentProfiles, loadDriftBottles, loadTimeCapsules]);

  const childMenuItems = [
    { id: "bottle", label: "漂流瓶", icon: "🏺", count: driftBottles.length },
    { id: "capsule", label: "时光胶囊", icon: "⏳", count: timeCapsules.length },
    { id: "translate", label: "翻译器", icon: "🔍", count: 0 },
    { id: "treehole", label: "树洞", icon: "🌲", count: userProfile?.conflictFrequency || 0 },
  ];

  const parentMenuItems = [
    { id: "bottle", label: "漂流瓶", icon: "🏺", count: driftBottles.length },
    { id: "capsule", label: "时光胶囊", icon: "⏳", count: timeCapsules.length },
    { id: "translate", label: "翻译器", icon: "🔍", count: 0 },
  ];

  const menuItems = userType === "parent" ? parentMenuItems : childMenuItems;

  const settingsItems = [
    { id: "family", label: "家庭成员", icon: "👨‍👩‍👧" },
    { id: "privacy", label: "隐私设置", icon: "🔒" },
    { id: "about", label: "关于安语", icon: "ℹ️" },
  ];

  if (userType === "parent") {
    return (
      <div className="flex flex-col h-screen pb-20">
        <header className={`px-5 py-4 ${userType === 'parent' ? 'text-lg' : ''}`}>
          <h1 className="font-semibold text-gray-700">我的</h1>
        </header>

        <div className="flex-1 px-5 py-4 overflow-y-auto">
          {isLoading && <Loading text="加载中..." />}

          {!isLoading && (
            <>
              {/* 用户头像 */}
              <div className="bg-gradient-to-br from-oupink to-tianqing rounded-3xl p-6 text-white mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">安语家长</h2>
                    <p className="text-sm text-white/80">与孩子温暖沟通</p>
                  </div>
                </div>
              </div>

              {/* 用户类型切换 */}
              <div className="bg-yuebai rounded-2xl p-4 border border-tianqing/10 mb-6">
                <p className="text-sm text-gray-600 mb-3">当前身份</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserType("child")}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all bg-mibai text-gray-600"
                  >
                    孩子端
                  </button>
                  <button
                    onClick={() => setUserType("parent")}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all bg-tianqing text-white"
                  >
                    家长端
                  </button>
                </div>
              </div>

              {/* 数据统计 */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-mibai rounded-2xl p-4 border border-tianqing/10 text-center">
                  <p className="text-2xl font-bold text-tianqing">
                    {userProfile?.conflictFrequency || 0}
                  </p>
                  <p className="text-sm text-gray-400">互动次数</p>
                </div>
                <div className="bg-mibai rounded-2xl p-4 border border-tianqing/10 text-center">
                  <p className="text-2xl font-bold text-oupink">{driftBottles.length}</p>
                  <p className="text-sm text-gray-400">漂流瓶</p>
                </div>
                <div className="bg-mibai rounded-2xl p-4 border border-tianqing/10 text-center">
                  <p className="text-2xl font-bold text-green-500">{timeCapsules.length}</p>
                  <p className="text-sm text-gray-400">时光胶囊</p>
                </div>
              </div>

              {/* 功能入口 */}
              <div className="bg-mibai rounded-2xl p-5 border border-tianqing/10 mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">快捷功能</h3>
                <div className="grid grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/${item.id}`)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-14 h-14 rounded-xl bg-yuebai flex items-center justify-center">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.label}</span>
                      {item.count > 0 && (
                        <span className="text-xs text-tianqing font-medium">{item.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 家庭成员 */}
              <div className="bg-mibai rounded-2xl p-5 border border-tianqing/10 mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">家庭成员</h3>
                <div className="space-y-3">
                  {parentProfiles.map((parent) => (
                    <div
                      key={parent.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-yuebai transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-yuebai flex items-center justify-center">
                        <span className="text-lg text-gray-600 font-medium">
                          {parent.displayName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-gray-800">{parent.displayName}</p>
                        <p className="text-sm text-gray-400">
                          {parent.linked ? "已关联" : "未关联"}
                        </p>
                      </div>
                      <span className="text-gray-300">›</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 设置 */}
              <div className="bg-mibai rounded-2xl border border-tianqing/10 overflow-hidden">
                {settingsItems.map((item, index) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-5 py-4 ${
                      index !== settingsItems.length - 1 ? "border-b border-tianqing/10" : ""
                    } hover:bg-yuebai transition-colors`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-base text-gray-700 flex-1 text-left">{item.label}</span>
                    <span className="text-gray-300">›</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // 孩子端个人页面
  return (
    <div className="flex flex-col h-screen pb-16">
      <header className="px-4 py-4">
        <h1 className="font-semibold text-lg">我的</h1>
      </header>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {isLoading && <Loading text="加载中..." />}

        {!isLoading && (
          <>
            {/* 用户头像 */}
            <div className="bg-gradient-to-br from-oupink to-tianqing rounded-3xl p-6 text-white mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">🌸</span>
                </div>
                <div>
                  <h2 className="font-bold">安语用户</h2>
                  <p className="text-sm text-white/80">让爱，无需言说</p>
                </div>
              </div>
            </div>

            {/* 用户类型切换 */}
            <div className="bg-yuebai rounded-2xl p-4 border border-tianqing/10 mb-6">
              <p className="text-xs text-gray-600 mb-3">当前身份</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserType("child")}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all bg-tianqing text-white"
                >
                  孩子端
                </button>
                <button
                  onClick={() => setUserType("parent")}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all bg-mibai text-gray-600"
                >
                  家长端
                </button>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                <p className="text-2xl font-bold text-tianqing">
                  {userProfile?.conflictFrequency || 0}
                </p>
                <p className="text-xs text-gray-400">倾诉次数</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                <p className="text-2xl font-bold text-oupink">{driftBottles.length}</p>
                <p className="text-xs text-gray-400">漂流瓶</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
                <p className="text-2xl font-bold text-green-500">{timeCapsules.length}</p>
                <p className="text-xs text-gray-400">时光胶囊</p>
              </div>
            </div>

            {/* 功能入口 */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
              <h3 className="font-medium text-gray-800 mb-4">快捷功能</h3>
              <div className="grid grid-cols-4 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/${item.id}`)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                    {item.count > 0 && (
                      <span className="text-[10px] text-tianqing">{item.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 家庭成员 */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
              <h3 className="font-medium text-gray-800 mb-4">家庭成员</h3>
              <div className="space-y-3">
                {parentProfiles.map((parent) => (
                  <div
                    key={parent.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {parent.displayName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{parent.displayName}</p>
                      <p className="text-xs text-gray-400">
                        {parent.linked ? "已关联" : "未关联"}
                      </p>
                    </div>
                    <span className="text-gray-300">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 设置 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {settingsItems.map((item, index) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 ${
                    index !== settingsItems.length - 1 ? "border-b border-gray-50" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm text-gray-700 flex-1 text-left">{item.label}</span>
                  <span className="text-gray-300">→</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
