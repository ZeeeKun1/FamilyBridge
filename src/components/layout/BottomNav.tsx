"use client";

import { usePathname, useRouter } from "next/navigation";
import Icon, { IconNames } from "@/components/shared/Icon";
import { useStore } from "@/lib/store";

// 统一导航：首页 / 写一条 / 收件箱 / 我的（父母端孩子端共用）
const navItems = [
  { id: "home", label: "首页", icon: IconNames.HOME, path: "/" },
  { id: "compose", label: "写一条", icon: IconNames.LETTER, path: "/bottle" },
  { id: "inbox", label: "收件箱", icon: IconNames.RECEIVE, path: "/inbox" },
  { id: "profile", label: "我的", icon: IconNames.PROFILE, path: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const getTimelineStats = useStore((s) => s.getTimelineStats);

  const stats = getTimelineStats();

  return (
    <nav className="flex-shrink-0 w-full h-16 border-t border-white/60 bg-mibai/92 px-3 pt-2 backdrop-blur-xl shadow-[0_-10px_30px_rgba(163,184,198,0.16)]">
      <div className="flex h-full items-center justify-around gap-1">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (!isActive) {
                  router.push(item.path);
                }
              }}
              className={`relative flex h-full min-w-[68px] flex-1 max-w-[86px] items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-white text-tianqing shadow-[0_8px_20px_rgba(163,184,198,0.18)]"
                  : "text-gray-400 hover:bg-white/70 hover:text-gray-600"
              }`}
            >
              {isActive && (
                <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-tianqing to-transparent" />
              )}
              <span className="flex flex-col items-center gap-1">
                <span className="relative">
                  <Icon
                    name={item.icon}
                    size={22}
                    className={`transition-transform duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  {item.id === "inbox" && stats.unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-medium flex items-center justify-center leading-none shadow-sm">
                      {stats.unreadCount > 9 ? "9+" : stats.unreadCount}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium leading-none">
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
