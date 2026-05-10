"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import BottomNav from "@/components/layout/BottomNav";

export default function HomePage() {
  const router = useRouter();
  const { userType, driftBottles, loadDriftBottles, openDriftBottle } = useStore();
  const [ripples, setRipples] = useState<number[]>([]);

  useEffect(() => {
    loadDriftBottles();
    const interval = setInterval(() => {
      const newId = Date.now();
      setRipples((prev) => [...prev.slice(-8), newId]);
    }, 2500);
    return () => clearInterval(interval);
  }, [loadDriftBottles]);

  const getWaveAnimation = useCallback(() => {
    const animations = ["wave-1", "wave-2", "wave-3"];
    return animations[Math.floor(Date.now() / 3000) % animations.length];
  }, []);

  const unopenedBottles = driftBottles.filter((b) => b.status === "sent" && b.receiverId === "self");

  if (userType === "parent") {
    return (
      <div className="min-h-screen pb-16 bg-gradient-to-b from-mibai via-yuebai to-oupink/10">
        <header className="px-5 py-4 bg-mibai/80 backdrop-blur-sm border-b border-tianqing/10">
          <h1 className="text-xl font-semibold text-gray-700 text-center">安语</h1>
          <p className="text-xs text-gray-400 text-center mt-1">传递心意，温暖家人</p>
        </header>

        <div className="px-5 py-6">
          <button
            onClick={() => router.push("/bottle")}
            className="w-full bg-gradient-to-r from-tianqing to-oupink rounded-2xl p-6 text-white shadow-lg mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">发送心意</h2>
                <p className="text-sm opacity-80">用漂流瓶传递你的关爱</p>
              </div>
              <span className="text-4xl">🏺</span>
            </div>
          </button>

          <button
            onClick={() => router.push("/capsule")}
            className="w-full bg-yuebai rounded-2xl p-6 border border-tianqing/10 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">时光胶囊</h2>
                <p className="text-sm text-gray-400">记录美好时光</p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </button>

          {unopenedBottles.length > 0 && (
            <div className="bg-yuebai rounded-2xl p-4 border border-tianqing/10">
              <h3 className="text-base font-semibold text-gray-700 mb-3">收到的心意 ({unopenedBottles.length})</h3>
              <div className="space-y-3">
                {unopenedBottles.slice(0, 3).map((bottle) => (
                  <button
                    key={bottle.id}
                    onClick={() => openDriftBottle(bottle.id)}
                    className="w-full bg-mibai rounded-xl p-4 flex items-center gap-3 border border-tianqing/10"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-oupink/20 to-tianqing/20 flex items-center justify-center">
                      <span className="text-2xl">💌</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-700">来自家人的心意</p>
                      <p className="text-xs text-gray-400">{new Date(bottle.sentAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-gray-300">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => router.push("/translate")}
            className="w-full mt-6 bg-yuebai rounded-2xl p-6 border border-tianqing/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">贴心翻译</h2>
                <p className="text-sm text-gray-400">轻松理解孩子的网络用语</p>
              </div>
              <span className="text-4xl">🌐</span>
            </div>
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-14 bg-eastern-gradient relative overflow-hidden">
      <div className={`absolute inset-0 ${getWaveAnimation()}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-tianqing/20 via-transparent to-oupink/15" />
        <div className="absolute inset-0">
          {ripples.map((id) => (
            <div
              key={id}
              className="absolute w-32 h-32 rounded-full border border-tianqing/20 animate-ripple-slow"
              style={{
                left: `${10 + Math.random() * 75}%`,
                top: `${15 + Math.random() * 55}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-40">
        <div className="absolute top-0 left-1/4 w-px h-20 bg-gradient-to-b from-tianqing/30 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-16 bg-gradient-to-b from-oupink/30 to-transparent" />
        <div className="absolute top-4 left-8 w-3 h-3 rounded-full bg-oupink/20 animate-float-slow" />
        <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-tianqing/30 animate-float" />
      </div>

      <div className="relative z-10">
        <header className="px-5 pt-8 pb-4">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-700 tracking-wider">心湖</h1>
            <p className="text-xs text-gray-400 mt-2 tracking-widest">静 · 听 · 心 · 声</p>
          </div>
        </header>

        <div className="px-5 pb-24">
          <div className="relative mb-6">
            <div className="absolute -left-2 top-1/2 w-1 h-8 bg-gradient-to-t from-transparent to-tianqing/30 rounded-full" />
            <div className="h-px bg-gradient-to-r from-transparent via-tianqing/20 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/treehole")}
              className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-lg shadow-tianqing/5 overflow-hidden aspect-[3/3.5] flex flex-col"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-green-200/40 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-inner flex-shrink-0">
                <span className="text-2xl leading-none">🌲</span>
              </div>
              <h3 className="font-medium text-gray-700 text-sm mt-4">思绪森林</h3>
              <p className="text-xs text-gray-400 mt-1">倾诉心事</p>
              <div className="mt-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-500">倾听中</span>
              </div>
            </button>

            <button
              onClick={() => router.push("/bottle")}
              className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-lg shadow-oupink/5 overflow-hidden aspect-[3/3.5] flex flex-col"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-oupink-200/40 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-oupink-100 to-oupink-200 flex items-center justify-center shadow-inner flex-shrink-0">
                <span className="text-2xl leading-none">🏺</span>
              </div>
              <h3 className="font-medium text-gray-700 text-sm mt-4">心意花园</h3>
              <p className="text-xs text-gray-400 mt-1">传递心意</p>
              {unopenedBottles.length > 0 && (
                <div className="mt-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-oupink-400 animate-pulse" />
                  <span className="text-[10px] text-oupink-500">{unopenedBottles.length}封新信</span>
                </div>
              )}
            </button>

            <button
              onClick={() => router.push("/weather")}
              className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-lg shadow-blue-500/5 overflow-hidden aspect-[3/3.5] flex flex-col"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-inner flex-shrink-0">
                <span className="text-2xl leading-none">🌤️</span>
              </div>
              <h3 className="font-medium text-gray-700 text-sm mt-4">情绪气象</h3>
              <p className="text-xs text-gray-400 mt-1">记录心情</p>
              <div className="mt-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] text-blue-500">记录中</span>
              </div>
            </button>

            <button
              onClick={() => router.push("/capsule")}
              className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-lg shadow-amber-500/5 overflow-hidden aspect-[3/3.5] flex flex-col"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-amber-200/40 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-inner flex-shrink-0">
                <span className="text-2xl leading-none">⏳</span>
              </div>
              <h3 className="font-medium text-gray-700 text-sm mt-4">时光胶囊</h3>
              <p className="text-xs text-gray-400 mt-1">封存记忆</p>
              <div className="mt-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] text-amber-500">珍藏中</span>
              </div>
            </button>
          </div>

          {unopenedBottles.length > 0 && (
            <div className="mt-8 relative">
              <div className="absolute -left-2 top-1/2 w-1 h-12 bg-gradient-to-t from-transparent to-oupink/30 rounded-full" />
              <div className="h-px bg-gradient-to-r from-transparent via-oupink/20 to-transparent mb-4" />
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💌</span>
                    <h3 className="font-medium text-gray-700 text-sm">待启的心意</h3>
                  </div>
                  <span className="text-xs text-tianqing bg-tianqing/10 px-2 py-1 rounded-full">{unopenedBottles.length}封</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {unopenedBottles.slice(0, 5).map((bottle, index) => (
                    <button
                      key={bottle.id}
                      onClick={() => router.push("/records")}
                      className="relative flex-shrink-0"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-oupink/20 to-tianqing/20 flex items-center justify-center border border-white/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <span className="text-xl">💌</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white text-[8px] text-white flex items-center justify-center animate-pulse">
                        !
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-white/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-tianqing to-oupink animate-pulse" />
              <p className="text-xs text-gray-500 tracking-wider">轻轻倾诉，静静聆听</p>
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-oupink to-tianqing animate-pulse" />
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 opacity-40">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">☁️</span>
              <span className="text-[10px] text-gray-400">云淡</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">🌊</span>
              <span className="text-[10px] text-gray-400">心静</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">🍃</span>
              <span className="text-[10px] text-gray-400">风轻</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
