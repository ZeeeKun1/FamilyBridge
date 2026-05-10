"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import Loading from "@/components/shared/Loading";
import { useStore } from "@/lib/store";
import { EmotionWeather } from "@/lib/types";

const emotionIcons: Record<string, string> = {
  "平静": "😊",
  "焦虑": "😰",
  "委屈": "🥺",
  "愤怒": "😤",
  "悲伤": "😢",
  "开心": "😄",
  "烦躁": "😫",
  "孤独": "🥀",
};

const emotionColors: Record<string, string> = {
  "平静": "from-green-100 to-green-50",
  "焦虑": "from-yellow-100 to-yellow-50",
  "委屈": "from-blue-100 to-blue-50",
  "愤怒": "from-red-100 to-red-50",
  "悲伤": "from-purple-100 to-purple-50",
  "开心": "from-pink-100 to-pink-50",
  "烦躁": "from-orange-100 to-orange-50",
  "孤独": "from-gray-100 to-gray-50",
};

type ViewMode = "day" | "week" | "month";

export default function WeatherPage() {
  const router = useRouter();
  const {
    emotionWeather,
    recentWeathers,
    loadEmotionWeathers,
    isLoading,
  } = useStore();
  const initialized = useRef(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredWeathers, setFilteredWeathers] = useState<EmotionWeather[]>([]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadEmotionWeathers();
    }
  }, [loadEmotionWeathers]);

  useEffect(() => {
    if (recentWeathers.length === 0) return;
    
    let filtered: EmotionWeather[] = [];
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (viewMode === "day") {
      filtered = recentWeathers.filter(w => {
        const date = new Date(w.timestamp);
        return date >= startOfDay && date <= endOfDay;
      });
    } else if (viewMode === "week") {
      const dayOfWeek = selectedDate.getDay();
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      
      filtered = recentWeathers.filter(w => {
        const date = new Date(w.timestamp);
        return date >= monday && date <= sunday;
      });
    } else if (viewMode === "month") {
      const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      
      filtered = recentWeathers.filter(w => {
        const date = new Date(w.timestamp);
        return date >= firstDay && date <= lastDay;
      });
    }
    
    setFilteredWeathers(filtered);
  }, [recentWeathers, viewMode, selectedDate]);

  const getWeatherState = () => {
    if (!emotionWeather) return { icon: "🌤️", label: "暂无数据", bg: "from-gray-100 to-gray-50" };
    
    const intensity = emotionWeather.intensity;
    if (intensity < 30) {
      return { icon: "🌤️", label: "心平气和", bg: "from-green-100 to-green-50" };
    } else if (intensity < 60) {
      return { icon: "🌥️", label: "有些波动", bg: "from-yellow-100 to-yellow-50" };
    } else if (intensity < 80) {
      return { icon: "⛅", label: "情绪起伏", bg: "from-orange-100 to-orange-50" };
    } else {
      return { icon: "🌧️", label: "需要倾诉", bg: "from-red-100 to-red-50" };
    }
  };

  const getWeekDays = () => {
    const days = [];
    const dayOfWeek = selectedDate.getDay();
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getMonthDays = () => {
    const days = [];
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      days.push(date);
    }
    
    return days;
  };

  const getDayWeathers = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return recentWeathers.filter(w => {
      const wDate = new Date(w.timestamp);
      return wDate >= startOfDay && wDate <= endOfDay;
    });
  };

  const getDayEmotion = (weathers: EmotionWeather[]) => {
    if (weathers.length === 0) return null;
    return weathers.reduce((prev, curr) => 
      curr.intensity > prev.intensity ? curr : prev
    );
  };

  const weather = getWeatherState();

  return (
    <div className="flex flex-col h-screen pb-16 bg-gradient-to-b from-yuebai to-mibai">
      <header className="px-4 py-4 bg-mibai/80 backdrop-blur-sm border-b border-tianqing/10">
        <h1 className="font-semibold font-song text-lg text-gray-700">情绪气象站</h1>
        <p className="text-xs text-gray-400 mt-1">记录你的心情变化</p>
      </header>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {isLoading && <Loading text="加载中..." />}

        {!isLoading && (
          <>
            {/* 当前情绪状态 */}
            <div className={`rounded-3xl p-6 bg-gradient-to-br ${weather.bg} mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-4xl">{weather.icon}</span>
                  <p className="text-gray-700 font-song text-lg mt-1">{weather.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">
                    {emotionWeather?.intensity || 0}%
                  </p>
                  <p className="text-xs text-gray-500">情绪强度</p>
                </div>
              </div>

              {emotionWeather && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emotionIcons[emotionWeather.primaryEmotion] || "💭"}</span>
                  <span className="text-sm text-gray-600">
                    当前情绪：{emotionWeather.primaryEmotion}
                  </span>
                </div>
              )}
            </div>

            {/* 视图切换 */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">历史记录</h3>
                <div className="flex bg-gray-100 rounded-full p-1">
                  {([{ mode: "day", label: "日" }, { mode: "week", label: "周" }, { mode: "month", label: "月" }] as const).map(item => (
                    <button
                      key={item.mode}
                      onClick={() => setViewMode(item.mode)}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        viewMode === item.mode 
                          ? "bg-white shadow-sm text-gray-700" 
                          : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 日历视图 */}
              {viewMode === "day" && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 1);
                      setSelectedDate(prev);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ←
                  </button>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">
                      {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
                    </p>
                    <p className="text-xs text-gray-400">
                      {["周日", "周一", "周二", "周三", "周四", "周五", "周六"][selectedDate.getDay()]}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 1);
                      setSelectedDate(next);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    →
                  </button>
                </div>
              )}

              {viewMode === "week" && (
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 7);
                      setSelectedDate(prev);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ←
                  </button>
                  <div className="text-center">
                    {(() => {
                      const days = getWeekDays();
                      return `${days[0].getMonth() + 1}/${days[0].getDate()} - ${days[6].getMonth() + 1}/${days[6].getDate()}`;
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 7);
                      setSelectedDate(next);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    →
                  </button>
                </div>
              )}

              {viewMode === "month" && (
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setMonth(prev.getMonth() - 1);
                      setSelectedDate(prev);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ←
                  </button>
                  <div className="text-center">
                    {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
                  </div>
                  <button
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setMonth(next.getMonth() + 1);
                      setSelectedDate(next);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    →
                  </button>
                </div>
              )}

              {/* 周视图 */}
              {viewMode === "week" && (
                <div className="grid grid-cols-7 gap-1">
                  {getWeekDays().map((day, index) => {
                    const dayWeathers = getDayWeathers(day);
                    const dayEmotion = getDayEmotion(dayWeathers);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                          isSelected 
                            ? "bg-tianqing/20" 
                            : isToday 
                              ? "bg-oupink/20" 
                              : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-[10px] text-gray-400 mb-1">
                          {["一", "二", "三", "四", "五", "六", "日"][index]}
                        </span>
                        <span className={`text-sm font-medium ${
                          isToday ? "text-tianqing" : "text-gray-700"
                        }`}>
                          {day.getDate()}
                        </span>
                        {dayEmotion && (
                          <span className="text-lg mt-1">{emotionIcons[dayEmotion.primaryEmotion]}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 月视图 */}
              {viewMode === "month" && (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["一", "二", "三", "四", "五", "六", "日"].map(day => (
                      <div key={day} className="text-center text-[10px] text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getMonthDays().map((day, index) => {
                      if (!day) return <div key={index} />;
                      
                      const dayWeathers = getDayWeathers(day);
                      const dayEmotion = getDayEmotion(dayWeathers);
                      const isToday = day.toDateString() === new Date().toDateString();
                      const isSelected = day.toDateString() === selectedDate.toDateString();
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(day)}
                          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                            isSelected 
                              ? "bg-tianqing/20" 
                              : isToday 
                                ? "bg-oupink/20" 
                                : "hover:bg-gray-50"
                          }`}
                        >
                          <span className={`text-sm font-medium ${
                            isToday ? "text-tianqing" : "text-gray-700"
                          }`}>
                            {day.getDate()}
                          </span>
                          {dayEmotion && (
                            <span className="text-xs mt-1">{emotionIcons[dayEmotion.primaryEmotion]}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* 选中日期的详细记录 */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                {viewMode === "day" && `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`}
                {viewMode === "week" && "本周记录"}
                {viewMode === "month" && `${selectedDate.getMonth() + 1}月记录`}
                <span className="text-xs text-gray-400 ml-2">({filteredWeathers.length}条)</span>
              </h3>
              
              {filteredWeathers.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">暂无记录</p>
              ) : (
                <div className="space-y-3">
                  {filteredWeathers.map((w: EmotionWeather) => (
                    <div
                      key={w.timestamp}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${emotionColors[w.primaryEmotion] || "from-gray-50 to-transparent"}`}
                    >
                      <span className="text-xl">{emotionIcons[w.primaryEmotion] || "💭"}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{w.primaryEmotion}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(w.timestamp).toLocaleString("zh-CN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{w.intensity}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 情绪趋势 */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
              <h3 className="font-medium text-gray-800 mb-4">情绪趋势</h3>
              <div className="flex items-end justify-between h-24 gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const dayIndex = 6 - i;
                  const weather = recentWeathers[dayIndex];
                  const height = weather ? (weather.intensity / 100) * 100 : Math.random() * 60 + 20;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t-lg bg-tianqing/40 transition-all hover:bg-tianqing/60"
                        style={{ height: `${height}%`, minHeight: "20px" }}
                      />
                      <span className="text-[10px] text-gray-400 mt-1">
                        {["日", "一", "二", "三", "四", "五", "六"][new Date().getDay() - i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 建议 */}
            {emotionWeather && emotionWeather.intensity > 60 && (
              <div className="mt-4 bg-oupink/20 rounded-2xl p-4">
                <p className="text-sm text-gray-700">
                  💡 情绪有点高涨，要不要去{" "}
                  <button
                    onClick={() => router.push("/treehole")}
                    className="text-tianqing underline"
                  >
                    树洞
                  </button>{" "}
                  倾诉一下？
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
