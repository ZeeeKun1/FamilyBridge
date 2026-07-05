"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-mibai flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tianqing/10 to-oupink/10 flex items-center justify-center mb-6">
        <span className="text-3xl">🍃</span>
      </div>
      <h1 className="text-lg font-light text-gray-700 mb-2 tracking-wider">
        哎呀，出了点小问题
      </h1>
      <p className="text-xs text-gray-400 text-center mb-6 max-w-[260px] leading-6">
        安语遇到了一个意外错误，请稍后再试
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl text-sm font-medium active:scale-95 transition-transform shadow-md"
      >
        再试一次
      </button>
      <p className="text-[10px] text-gray-300 mt-8 tracking-widest">
        安 · 语 · 让爱无需言说
      </p>
    </div>
  );
}
