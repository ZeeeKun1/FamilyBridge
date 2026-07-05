"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/shared/Loading";
import { useStore } from "@/lib/store";
import { EmotionWeather } from "@/lib/types";
import Icon, { IconNames } from "@/components/shared/Icon";

const emotionIcons: Record<string, string> = {
  "平静": IconNames.CALM,
  "焦虑": IconNames.ANXIOUS,
  "委屈": IconNames.SAD,
  "愤怒": IconNames.ANGRY,
  "悲伤": IconNames.SAD,
  "开心": IconNames.HAPPY,
  "烦躁": IconNames.ANXIOUS,
  "孤独": IconNames.LONELY,
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
  const { emotionWeather, recentWeathers, loadEmotionWeathers, isLoading } = useStore();
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
    let filtered: EmotionWeather[] = [];
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (viewMode === "day") {
      filtered = recentWeathers.filter((w) => {
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

      filtered = recentWeathers.filter((w) => {
        const date = new Date(w.timestamp);
        return date >= monday && date <= sunday;
      });
    } else {
      const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);

      filtered = recentWeathers.filter((w) => {
        const date = new Date(w.timestamp);
        return date >= firstDay && date <= lastDay;
      });
    }

    setFilteredWeathers(filtered.sort((a, b) => b.timestamp - a.timestamp));
  }, [recentWeathers, viewMode, selectedDate]);

  const getWeatherState = () => {
    if (!emotionWeather) {
      return { icon: IconNames.WEATHER, label: "暂无数据", bg: "from-gray-100 to-gray-50" };
    }

    const intensity = emotionWeather.intensity;
    if (intensity < 30) {
      return { icon: IconNames.CALM, label: "心平气和", bg: "from-green-100 to-green-50" };
    }
    if (intensity < 60) {
      return { icon: IconNames.ANXIOUS, label: "有些波动", bg: "from-yellow-100 to-yellow-50" };
    }
    if (intensity < 80) {
      return { icon: IconNames.ANGRY, label: "情绪起伏", bg: "from-orange-100 to-orange-50" };
    }
    return { icon: IconNames.SAD, label: "需要倾诉", bg: "from-red-100 to-red-50" };
  };

  const getWeekDays = () => {
    const days: Date[] = [];
    const dayOfWeek = selectedDate.getDay();
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    for (let i = 0; i < 7; i += 1) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getMonthDays = () => {
    const days: Array<Date | null> = [];
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = 0; i < startPadding; i += 1) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i += 1) {
      days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
    }

    return days;
  };

  const getDayWeathers = useCallback((date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return recentWeathers.filter((w) => {
      const wDate = new Date(w.timestamp);
      return wDate >= startOfDay && wDate <= endOfDay;
    });
  }, [recentWeathers]);

  const getDayEmotion = (weathers: EmotionWeather[]) => {
    if (weathers.length === 0) return null;
    return weathers.reduce((prev, curr) => (curr.intensity > prev.intensity ? curr : prev));
  };

  const getViewLabel = () => {
    if (viewMode === "day") {
      return `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
    }
    if (viewMode === "week") {
      return "本周记录";
    }
    return `${selectedDate.getMonth() + 1}月记录`;
  };

  const trendData = useMemo(() => {
    const today = new Date();
    const items = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dailyWeathers = getDayWeathers(date);
      const strongest = getDayEmotion(dailyWeathers);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        label: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()],
        intensity: strongest?.intensity ?? 0,
        emotion: strongest?.primaryEmotion ?? null,
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });

    const maxIntensity = Math.max(...items.map((item) => item.intensity), 0);

    return items.map((item) => ({
      ...item,
      height: item.intensity === 0 ? 18 : Math.max(24, (item.intensity / Math.max(maxIntensity, 100)) * 100),
    }));
  }, [getDayWeathers]);

  const summaryText = useMemo(() => {
    if (filteredWeathers.length === 0) {
      return "这一段时间还没有情绪记录。";
    }

    const avg = Math.round(
      filteredWeathers.reduce((sum, item) => sum + item.intensity, 0) / filteredWeathers.length
    );
    const strongest = filteredWeathers.reduce((prev, curr) => (curr.intensity > prev.intensity ? curr : prev));

    return `共记录${filteredWeathers.length}次，平均强度${avg}%，最明显的情绪是${strongest.primaryEmotion}。`;
  }, [filteredWeathers]);

  const weather = getWeatherState();

  return (
    <div className="flex flex-col bg-gradient-to-b from-yuebai to-mibai">
      <header className="px-4 py-4 bg-mibai/80 backdrop-blur-sm border-b border-tianqing/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-semibold font-song text-lg text-gray-700">情绪气象站</h1>
            <p className="text-xs text-gray-400 mt-1">记录你的心情变化</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDate(new Date())}
            className="rounded-full bg-white/80 px-3 py-1.5 text-xs text-tianqing border border-tianqing/10 active:scale-95 transition-transform"
          >
            回到今天
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {isLoading && <Loading text="加载中..." />}

        {!isLoading && (
          <>
            <div className={`rounded-3xl p-6 bg-gradient-to-br ${weather.bg} mb-6 shadow-soft`}>
              <div className="flex items-center justify-between mb-4 gap-4">
                <div>
                  <Icon name={weather.icon} size={40} />
                  <p className="text-gray-700 font-song text-lg mt-1">{weather.label}</p>
                  <p className="text-xs text-gray-500 mt-2">最近一次情绪记录会显示在这里</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">{emotionWeather?.intensity || 0}%</p>
                  <p className="text-xs text-gray-500">情绪强度</p>
                </div>
              </div>

              {emotionWeather ? (
                <div className="flex items-center gap-2">
                  <Icon name={emotionIcons[emotionWeather.primaryEmotion] || IconNames.CALM} size={20} />
                  <span className="text-sm text-gray-600">当前情绪：{emotionWeather.primaryEmotion}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/treehole")}
                  className="text-sm text-tianqing underline underline-offset-4"
                >
                  先去记录一次心情
                </button>
              )}
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100 mb-6 shadow-soft">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div>
                  <h3 className="font-medium text-gray-800">历史记录</h3>
                  <p className="text-xs text-gray-400 mt-1">支持按日、周、月查看情绪变化</p>
                </div>
                <div className="flex bg-gray-100 rounded-full p-1 shrink-0">
                  {([
                    { mode: "day", label: "日" },
                    { mode: "week", label: "周" },
                    { mode: "month", label: "月" },
                  ] as const).map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setViewMode(item.mode)}
                      className={`px-3 py-1 text-xs rounded-full transition-all active:scale-95 ${
                        viewMode === item.mode ? "bg-white shadow-sm text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-yuebai/60 border border-tianqing/10 px-3 py-3 mb-4">
                {viewMode === "day" && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const prev = new Date(selectedDate);
                        prev.setDate(prev.getDate() - 1);
                        setSelectedDate(prev);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-gray-500 active:scale-95 transition-transform"
                    >
                      <Icon name={IconNames.BACK} size={18} />
                    </button>
                    <div className="text-center min-w-[132px]">
                      <p className="text-lg font-medium text-gray-700">
                        {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {[
                          "周日",
                          "周一",
                          "周二",
                          "周三",
                          "周四",
                          "周五",
                          "周六",
                        ][selectedDate.getDay()]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = new Date(selectedDate);
                        next.setDate(next.getDate() + 1);
                        setSelectedDate(next);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-gray-500 active:scale-95 transition-transform"
                    >
                      <Icon name={IconNames.SEND} size={18} />
                    </button>
                  </div>
                )}

                {viewMode === "week" && (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const prev = new Date(selectedDate);
                        prev.setDate(prev.getDate() - 7);
                        setSelectedDate(prev);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-gray-500 active:scale-95 transition-transform"
                    >
                      <Icon name={IconNames.BACK} size={18} />
                    </button>
                    <div className="text-center text-sm text-gray-700">
                      {(() => {
                        const days = getWeekDays();
                        return `${days[0].getMonth() + 1}/${days[0].getDate()} - ${days[6].getMonth() + 1}/${days[6].getDate()}`;
                      })()}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = new Date(selectedDate);
                        next.setDate(next.getDate() + 7);
                        setSelectedDate(next);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-gray-500 active:scale-95 transition-transform"
                    >
                      <Icon name={IconNames.SEND} size={18} />
                    </button>
                  </div>
                )}

                {viewMode === "month" && (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const prev = new Date(selectedDate);
                        prev.setMonth(prev.getMonth() - 1);
                        setSelectedDate(prev);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-gray-500 active:scale-95 transition-transform"
                    >
                      <Icon name={IconNames.BACK} size={18} />
                    </button>
                    <div className="text-center text-sm text-gray-700">
                      {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = new Date(selectedDate);
                        next.setMonth(next.getMonth() + 1);
                        setSelectedDate(next);
                      }}
                      className="w-9 h-9 rounded-full bg-white text-gray-500 active:scale-95 transition-transform"
                    >
                      <Icon name={IconNames.SEND} size={18} />
                    </button>
                  </div>
                )}
              </div>

              {viewMode === "week" && (
                <div className="grid grid-cols-7 gap-1">
                  {getWeekDays().map((day, index) => {
                    const dayWeathers = getDayWeathers(day);
                    const dayEmotion = getDayEmotion(dayWeathers);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day);
                          setViewMode("day");
                        }}
                        className={`flex min-h-[78px] flex-col items-center justify-center p-2 rounded-2xl transition-all active:scale-95 ${
                          isSelected ? "bg-tianqing/20" : isToday ? "bg-oupink/20" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-[10px] text-gray-400 mb-1">{["一", "二", "三", "四", "五", "六", "日"][index]}</span>
                        <span className={`text-sm font-medium ${isToday ? "text-tianqing" : "text-gray-700"}`}>
                          {day.getDate()}
                        </span>
                        {dayEmotion ? (
                          <Icon name={emotionIcons[dayEmotion.primaryEmotion] || IconNames.CALM} size={16} className="mt-1" />
                        ) : (
                          <span className="text-[10px] text-gray-300 mt-1">无</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {viewMode === "month" && (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                      <div key={day} className="text-center text-[10px] text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getMonthDays().map((day, index) => {
                      if (!day) return <div key={`empty-${index}`} className="min-h-[56px]" />;

                      const dayWeathers = getDayWeathers(day);
                      const dayEmotion = getDayEmotion(dayWeathers);
                      const isToday = day.toDateString() === new Date().toDateString();
                      const isSelected = day.toDateString() === selectedDate.toDateString();

                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          onClick={() => {
                            setSelectedDate(day);
                            setViewMode("day");
                          }}
                          className={`flex min-h-[56px] flex-col items-center justify-center p-2 rounded-2xl transition-all active:scale-95 ${
                            isSelected ? "bg-tianqing/20" : isToday ? "bg-oupink/20" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className={`text-sm font-medium ${isToday ? "text-tianqing" : "text-gray-700"}`}>
                            {day.getDate()}
                          </span>
                          {dayEmotion ? (
                            <Icon name={emotionIcons[dayEmotion.primaryEmotion] || IconNames.CALM} size={12} className="mt-1" />
                          ) : (
                            <span className="text-[10px] text-gray-300 mt-1">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100 mb-6 shadow-soft">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-medium text-gray-800">{getViewLabel()}</h3>
                  <p className="text-xs text-gray-400 mt-1">{summaryText}</p>
                </div>
                <span className="text-xs text-tianqing bg-tianqing/10 px-2.5 py-1 rounded-full">
                  {filteredWeathers.length}条
                </span>
              </div>

              {filteredWeathers.length === 0 ? (
                <div className="rounded-2xl bg-yuebai/50 px-4 py-8 text-center">
                  <p className="text-sm text-gray-400">暂无记录</p>
                  <button
                    type="button"
                    onClick={() => router.push("/treehole")}
                    className="mt-3 text-sm text-tianqing underline underline-offset-4"
                  >
                    去写下此刻感受
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredWeathers.map((w) => (
                    <div
                      key={w.timestamp}
                      className={`flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r ${emotionColors[w.primaryEmotion] || "from-gray-50 to-transparent"}`}
                    >
                      <Icon name={emotionIcons[w.primaryEmotion] || IconNames.CALM} size={20} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-gray-800 font-medium">{w.primaryEmotion}</p>
                          <span className="text-xs text-gray-500 shrink-0">{w.intensity}%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(w.timestamp).toLocaleString("zh-CN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100 mb-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">最近七天趋势</h3>
                <p className="text-[11px] text-gray-400">按每天最强情绪展示</p>
              </div>
              <div className="flex items-end justify-between h-28 gap-2">
                {trendData.map((item) => (
                  <div key={item.key} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="text-[10px] text-gray-400 mb-1 h-3">
                      {item.emotion ? (
                        <Icon name={emotionIcons[item.emotion] || IconNames.CALM} size={12} />
                      ) : null}
                    </div>
                    <div
                      className={`w-full rounded-t-xl transition-all ${item.isToday ? "bg-tianqing/60" : "bg-tianqing/35 hover:bg-tianqing/50"}`}
                      style={{ height: `${item.height}%`, minHeight: "18px" }}
                    />
                    <span className={`text-[10px] mt-2 ${item.isToday ? "text-tianqing" : "text-gray-400"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {emotionWeather && emotionWeather.intensity > 60 && (
              <div className="mt-4 bg-oupink/20 rounded-3xl p-4 border border-oupink/20">
                <p className="text-sm text-gray-700 leading-7">
                  <Icon name={IconNames.LIGHTBULB} size={16} className="inline mr-1" />
                  情绪有点高涨，要不要去
                  <button
                    type="button"
                    onClick={() => router.push("/treehole")}
                    className="mx-1 text-tianqing underline underline-offset-4"
                  >
                    树洞
                  </button>
                  轻轻说出来？
                </p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}