"use client";

import { useEffect, useState } from "react";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDesktop(window.innerWidth > 420);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // SSR / first render: render nothing extra so layout doesn't shift
  if (!mounted || !isDesktop) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900 overflow-hidden">
      {/* Phone outer body */}
      <div className="relative flex flex-col items-center">
        {/* Bezel */}
        <div
          className="relative bg-[#1a1a1e] rounded-[48px] p-3 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]"
          style={{ width: 405 }}
        >
          {/* Screen container */}
          <div
            className="relative rounded-[36px] overflow-hidden bg-white flex flex-col"
            style={{ width: 375, height: 812 }}
          >
            {/* Status bar */}
            <div className="flex-shrink-0 relative flex items-center justify-between px-6 pt-3 pb-1 bg-white z-10">
              {/* Time */}
              <span className="text-[15px] font-semibold text-black tracking-tight">
                9:41
              </span>

              {/* Dynamic Island */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full" />

              {/* Right icons: signal + wifi + battery */}
              <div className="flex items-center gap-1.5">
                {/* Signal bars */}
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  className="block"
                >
                  <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#000" />
                  <rect x="4" y="5" width="3" height="7" rx="0.5" fill="#000" />
                  <rect x="8" y="2" width="3" height="10" rx="0.5" fill="#000" />
                  <rect x="12" y="0" width="3" height="12" rx="0.5" fill="#000" />
                </svg>
                {/* WiFi */}
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  className="block"
                >
                  <path
                    d="M8 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                    fill="#000"
                    transform="translate(0,-3)"
                  />
                  <path
                    d="M4.5 8.5C5.5 7.2 6.7 6.5 8 6.5s2.5.7 3.5 2"
                    stroke="#000"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M2 5.5C3.8 3.5 5.8 2.5 8 2.5s4.2 1 6 3"
                    stroke="#000"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Battery */}
                <svg
                  width="27"
                  height="13"
                  viewBox="0 0 27 13"
                  fill="none"
                  className="block"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="22"
                    height="12"
                    rx="2.5"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <rect
                    x="2"
                    y="2"
                    width="18"
                    height="9"
                    rx="1.5"
                    fill="#000"
                  />
                  <path
                    d="M24 4.5v4a2 2 0 000-4z"
                    fill="#000"
                  />
                </svg>
              </div>
            </div>

            {/* App content area — children manage their own scrolling */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black/30 rounded-full" />
          </div>
        </div>

        {/* Side buttons (power & volume) — decorative */}
        {/* Right side: power button */}
        <div className="absolute -right-[2px] top-[180px] w-[3px] h-[60px] bg-neutral-600 rounded-r-sm" />
        {/* Left side: volume up */}
        <div className="absolute -left-[2px] top-[150px] w-[3px] h-[36px] bg-neutral-600 rounded-l-sm" />
        {/* Left side: volume down */}
        <div className="absolute -left-[2px] top-[200px] w-[3px] h-[36px] bg-neutral-600 rounded-l-sm" />
        {/* Left side: silent switch */}
        <div className="absolute -left-[2px] top-[115px] w-[3px] h-[20px] bg-neutral-600 rounded-l-sm" />
      </div>
    </div>
  );
}
