"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { DEMO_ACCOUNTS, getMember } from "@/lib/auth";
import Icon, { IconNames } from "@/components/shared/Icon";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentMember, hydrateSession } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  // 已登录则跳首页
  useEffect(() => {
    if (currentMember) {
      router.replace("/");
    }
  }, [currentMember, router]);

  const handleSubmit = () => {
    setError(null);
    const ok = login(username.trim(), password.trim());
    if (!ok) {
      setError("账号或密码错误，请使用下方的演示账号");
      return;
    }
    router.replace("/");
  };

  const handleQuickLogin = (account: typeof DEMO_ACCOUNTS[number]) => {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
    const ok = login(account.username, account.password);
    if (ok) {
      router.replace("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mibai via-yuebai to-oupink/10 flex flex-col">
      {/* 头部品牌 */}
      <header className="px-6 pt-16 pb-10 text-center">
        <p className="text-[11px] text-gray-400 tracking-[0.45em] mb-3">安 · 语</p>
        <h1 className="text-2xl font-light text-gray-700 tracking-wider">让爱，无需言说</h1>
        <p className="text-xs text-gray-400 mt-3 tracking-widest">登录以接收家人的心意</p>
      </header>

      {/* 表单 */}
      <div className="flex-1 px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-soft">
          <label className="block text-xs text-gray-400 tracking-widest mb-2">账号</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入账号"
            className="w-full bg-yuebai/60 rounded-2xl px-4 py-3 text-sm outline-none border border-tianqing/10 focus:border-tianqing/30 mb-4"
          />

          <label className="block text-xs text-gray-400 tracking-widest mb-2">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full bg-yuebai/60 rounded-2xl px-4 py-3 text-sm outline-none border border-tianqing/10 focus:border-tianqing/30 mb-5"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />

          {error && (
            <p className="text-xs text-rose-400 mb-3 text-center">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-3 text-sm font-medium active:scale-[0.98] transition-transform shadow-md"
          >
            登录
          </button>
        </div>

        {/* 演示账号区 */}
        <div className="mt-6 bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/50">
          <div className="flex items-center gap-2 mb-3">
            <Icon name={IconNames.SPARKLE} size={16} className="text-tianqing" />
            <p className="text-xs text-gray-500 tracking-widest">演示账号（点击直接登录）</p>
          </div>
          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((account) => {
              const member = getMember(account.memberId);
              if (!member) return null;
              const isParent = member.role === "parent";
              return (
                <button
                  key={account.username}
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 active:scale-[0.99] transition-transform shadow-sm text-left"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-medium ${
                      isParent
                        ? "bg-gradient-to-br from-oupink/40 to-rose-200/50 text-rose-600"
                        : "bg-gradient-to-br from-tianqing/30 to-blue-100/60 text-tianqing"
                    }`}
                  >
                    {member.displayName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {member.displayName}
                      <span className="ml-2 text-[10px] text-gray-400 tracking-wider">
                        {isParent ? "父母端" : "孩子端"}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      账号 {account.username} · 密码 {account.password}
                    </p>
                  </div>
                  <Icon name={IconNames.RECEIVE} size={16} className="text-gray-300" />
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center tracking-wider">
            两个账号属于同一家庭，可在两台设备/两个浏览器分别登录演示
          </p>
        </div>
      </div>

      <footer className="px-6 py-6 text-center">
        <p className="text-[10px] text-gray-400 tracking-widest">© 安语 · 让爱无需言说</p>
      </footer>
    </div>
  );
}
