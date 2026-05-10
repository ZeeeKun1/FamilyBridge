"use client";

import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

const childNavItems = [
  { id: "home", label: "心湖", icon: "🌊", path: "/" },
  { id: "weather", label: "气象站", icon: "🌤️", path: "/weather" },
  { id: "capsule", label: "时光", icon: "⏳", path: "/capsule" },
  { id: "profile", label: "我的", icon: "🌸", path: "/profile" },
];

const parentNavItems = [
  { id: "home", label: "首页", icon: "🏠", path: "/" },
  { id: "bottle", label: "漂流瓶", icon: "🏺", path: "/bottle" },
  { id: "capsule", label: "时光", icon: "⏳", path: "/capsule" },
  { id: "profile", label: "我的", icon: "👤", path: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { userType } = useStore();

  const navItems = userType === "parent" ? parentNavItems : childNavItems;

  return (
    <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-mibai/95 backdrop-blur-lg border-t border-tianqing/10 px-2 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(163,184,198,0.1)] ${userType === 'parent' ? 'h-16' : 'h-14'}`}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all duration-300 ${
              isActive
                ? "text-tianqing bg-tianqing/10"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className={`${userType === 'parent' ? 'text-2xl' : 'text-xl'} transition-transform ${isActive ? "scale-110" : ""}`}>
              {item.icon}
            </span>
            <span className={`font-medium ${userType === 'parent' ? 'text-sm' : 'text-[10px]'} ${isActive ? "" : ""}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
