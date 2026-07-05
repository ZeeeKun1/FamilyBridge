"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

// 允许未登录访问的路径前缀
const PUBLIC_PATHS = ["/login", "/demo"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentMember, hydrateSession } = useStore();

  // 启动时从 localStorage 恢复 session
  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));
    if (!isPublic && !currentMember) {
      // 给 hydrateSession 一个 tick 的机会，避免首屏闪烁
      const t = setTimeout(() => {
        if (!useStore.getState().currentMember) {
          router.replace("/login");
        }
      }, 0);
      return () => clearTimeout(t);
    }
  }, [pathname, currentMember, router]);

  return <>{children}</>;
}
