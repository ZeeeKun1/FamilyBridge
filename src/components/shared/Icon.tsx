"use client";

import React from "react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

// 东方美学图标系统 - 使用几何图形和线条
const icons: Record<string, React.ReactNode> = {
  // 核心功能图标
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  
  treehole: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C8 3 5 7 5 12c0 3 2 5 4 6" />
      <path d="M12 3c4 0 7 4 7 9c0 3-2 5-4 6" />
      <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  
  bottle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4h6v2H9z" />
      <path d="M8 6h8l1 4v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8l1-4z" />
      <path d="M10 12h4" opacity="0.5" />
    </svg>
  ),
  
  weather: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 16c0-2 2-4 4-4h8c2 0 4 2 4 4" />
      <path d="M8 20h8" opacity="0.5" />
    </svg>
  ),
  
  capsule: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12" />
      <path d="M6 12h12" opacity="0.3" />
    </svg>
  ),
  
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3 3-5 6-5s6 2 6 5" />
    </svg>
  ),
  
  // 情绪图标 - 使用颜色和形状表达
  calm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14c2 1 4 1 8 0" opacity="0.6" />
    </svg>
  ),
  
  anxious: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 10c1-1 3-1 4 0" />
      <path d="M12 10c1-1 3-1 4 0" />
      <path d="M9 15h6" opacity="0.6" />
    </svg>
  ),
  
  sad: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 16c2-2 6-2 8 0" opacity="0.6" />
    </svg>
  ),
  
  happy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 13c2 2 6 2 8 0" />
    </svg>
  ),
  
  angry: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 9l3 1" />
      <path d="M14 10l3-1" />
      <path d="M9 16h6" opacity="0.6" />
    </svg>
  ),
  
  lonely: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  
  // 意象图标 - 漂流瓶使用
  lamp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 10h8v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-8z" />
      <path d="M10 6h4v4h-4z" />
      <path d="M12 3v3" />
    </svg>
  ),
  
  tea: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8z" />
      <path d="M6 8c0-2 2-4 6-4s6 2 6 4" />
      <path d="M18 12h3v4h-3" opacity="0.5" />
    </svg>
  ),
  
  letter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 5 9-5" />
    </svg>
  ),
  
  spring: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20V8" />
      <path d="M8 12c0-2 2-4 4-4s4 2 4 4" />
      <path d="M6 8c0-3 3-5 6-5s6 2 6 5" opacity="0.5" />
    </svg>
  ),
  
  hug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="3" />
      <path d="M8 10c-2 2-2 6 0 8" />
      <path d="M16 10c2 2 2 6 0 8" />
      <path d="M10 12h4" opacity="0.5" />
    </svg>
  ),
  
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2" />
      <path d="M12 2l2 4h4l-3 3 1 5-4-2-4 2 1-5-3-3h4l2-4z" opacity="0.5" />
    </svg>
  ),
  
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20c-4-2-8-6-8-12 0-3 3-5 8-5s8 2 8 5c0 6-4 10-8 12z" />
      <path d="M12 5v15" opacity="0.3" />
    </svg>
  ),
  
  wind: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8h12c2 0 4 1 4 3s-2 3-4 3" />
      <path d="M4 12h8c2 0 3 1 3 2s-1 2-3 2" opacity="0.5" />
      <path d="M4 16h6" opacity="0.3" />
    </svg>
  ),
  
  // 状态图标
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  ),
  
  receive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M8 12h8" opacity="0.5" />
    </svg>
  ),
  
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 8l8 8" />
      <path d="M16 8l-8 8" />
    </svg>
  ),
  
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M14 8l-4 4 4 4" />
    </svg>
  ),
  
  voice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="9" y="4" width="6" height="12" rx="3" />
      <path d="M5 12c0 4 3 7 7 7s7-3 7-7" />
      <path d="M12 19v3" opacity="0.5" />
    </svg>
  ),
  
  voiceActive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="9" y="4" width="6" height="12" rx="3" fill="currentColor" opacity="0.2" />
      <path d="M5 12c0 4 3 7 7 7s7-3 7-7" />
      <path d="M12 19v3" />
      <circle cx="12" cy="12" r="10" strokeDasharray="4 2" opacity="0.3" />
    </svg>
  ),
  
  // 装饰图标
  wave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" opacity="0.5" />
      <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" opacity="0.3" />
    </svg>
  ),
  
  ripple: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="12" r="6" opacity="0.5" />
      <circle cx="12" cy="12" r="10" opacity="0.3" />
    </svg>
  ),
  
  breathing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.1" />
      <circle cx="12" cy="12" r="8" opacity="0.5" />
      <circle cx="12" cy="12" r="11" opacity="0.3" />
    </svg>
  ),
  
  // 分类图标
  all: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" opacity="0.5" />
    </svg>
  ),
  
  warmth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v4" opacity="0.5" />
      <path d="M12 18v4" opacity="0.5" />
      <path d="M2 12h4" opacity="0.5" />
      <path d="M18 12h4" opacity="0.5" />
    </svg>
  ),
  
  care: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21c-5-5-8-8-8-12a5 5 0 0110 0 5 5 0 0110 0c0 4-3 7-8 12z" />
    </svg>
  ),
  
  apology: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v18" />
      <path d="M6 9l6-6 6 6" opacity="0.5" />
    </svg>
  ),
  
  celebration: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" />
    </svg>
  ),
  
  memory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8" opacity="0.5" />
      <path d="M8 12h8" opacity="0.5" />
      <path d="M8 16h4" opacity="0.5" />
    </svg>
  ),
  
  // 其他
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" opacity="0.5" />
    </svg>
  ),
  
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
  
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  ),
  
  unlock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  ),
  
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 00-4 12.9V17h8v-2.1A7 7 0 0012 2z" />
    </svg>
  ),
};

export default function Icon({ name, size = 24, className = "", color }: IconProps) {
  const icon = icons[name];
  
  if (!icon) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={{ width: size, height: size, color }}>
        <circle cx="12" cy="12" r="10" opacity="0.3" />
      </svg>
    );
  }
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      className={className} 
      style={{ width: size, height: size, color }}
    >
      {icon}
    </svg>
  );
}

// 导出图标名称常量，方便使用
export const IconNames = {
  // 核心功能
  HOME: "home",
  TREEHOLE: "treehole",
  BOTTLE: "bottle",
  WEATHER: "weather",
  CAPSULE: "capsule",
  PROFILE: "profile",
  
  // 情绪
  CALM: "calm",
  ANXIOUS: "anxious",
  SAD: "sad",
  HAPPY: "happy",
  ANGRY: "angry",
  LONELY: "lonely",
  
  // 意象
  LAMP: "lamp",
  TEA: "tea",
  LETTER: "letter",
  SPRING: "spring",
  HUG: "hug",
  STAR: "star",
  LEAF: "leaf",
  WIND: "wind",
  
  // 状态
  SEND: "send",
  RECEIVE: "receive",
  CHECK: "check",
  CLOSE: "close",
  BACK: "back",
  VOICE: "voice",
  VOICE_ACTIVE: "voiceActive",
  
  // 装饰
  WAVE: "wave",
  RIPPLE: "ripple",
  BREATHING: "breathing",
  
  // 分类
  ALL: "all",
  WARMTH: "warmth",
  CARE: "care",
  APOLOGY: "apology",
  CELEBRATION: "celebration",
  MEMORY: "memory",
  
  // 其他
  SUN: "sun",
  MOON: "moon",
  LOCK: "lock",
  UNLOCK: "unlock",
  SPARKLE: "sparkle",
  LIGHTBULB: "lightbulb",
} as const;