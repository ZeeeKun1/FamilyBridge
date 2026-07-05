"use client";

import { useState, useEffect, useRef } from "react";

import { useStore } from "@/lib/store";

export default function CapsulePage() {
  const {
    userType, timeCapsules, loadTimeCapsules, createTimeCapsule, openCapsule, isLoading } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [selectedCapsule, setSelectedCapsule] = useState<typeof timeCapsules[0] | null>(null);
  const [showOpened, setShowOpened] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadTimeCapsules();
    }
  }, [loadTimeCapsules]);

  const futureCapsules = timeCapsules.filter((c) => c.status === "sealed");
  const pastCapsules = timeCapsules.filter((c) => c.status === "opened");
  const unopenedCapsules = [...futureCapsules, ...pastCapsules].slice(0, 5);

  const handleCreate = async () => {
    if (!content.trim() || !openDate) return;

    try {
      await createTimeCapsule({
        content: content.trim(),
        createdAt: Date.now(),
        openAt: new Date(openDate).getTime(),
        status: "sealed",
      });
      setShowCreate(false);
      setContent("");
      setOpenDate("");
    } catch {
      /* error handled by store */
    }
  };

  const handleOpenCapsule = async (capsule: typeof timeCapsules[0]) => {
    if (capsule.status === "sealed" && capsule.openAt > Date.now()) {
      return;
    }

    if (capsule.status === "sealed") {
      await openCapsule(capsule.id);
    }

    setSelectedCapsule({ ...capsule, status: capsule.status === "sealed" && capsule.openAt <= Date.now() ? "opened" : capsule.status });
    setShowOpened(true);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="flex flex-col bg-gradient-to-b from-yuebai to-mibai">
      <header className="flex items-center px-4 py-3 bg-mibai/90 backdrop-blur-md border-b border-tianqing/10">
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-gray-700">时光胶囊</h1>
          <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">封存此刻，留给未来</p>
        </div>
      </header>

      {showOpened && selectedCapsule ? (
        <div className="flex-1 px-5 py-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-5 shadow-md animate-glow">
            <span className="text-4xl leading-none">⏳</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            {selectedCapsule.status === "opened" ? "时光胶囊已开启" : "时光胶囊"}
          </h2>
          <p className="text-xs text-gray-400 mb-7">
            {selectedCapsule.status === "opened"
              ? `${new Date(selectedCapsule.createdAt).toLocaleDateString("zh-CN")} 写下`
              : `${new Date(selectedCapsule.openAt).toLocaleDateString("zh-CN")} 可开启`}
          </p>

          <div className="w-full bg-white rounded-3xl p-6 mb-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">{selectedCapsule.content}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowOpened(false);
              setSelectedCapsule(null);
            }}
            className="w-full bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-3 text-sm font-medium active:scale-[0.98] transition-transform shadow-md"
          >
            我知道了
          </button>
        </div>
      ) : showCreate ? (
        <div className="flex-1 px-5 py-6">
          <div className="flex items-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 active:scale-95 transition-transform shadow-sm"
            >
              ←
            </button>
            <h2 className="text-base font-semibold text-gray-700">写下胶囊</h2>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-5">
            <p className="text-xs text-gray-400 mb-3">写给未来的自己或家人</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="此刻想说什么..."
              rows={6}
              className="w-full text-sm text-gray-700 outline-none resize-none leading-7"
            />
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
            <p className="text-xs text-gray-400 mb-3">什么时候开启？</p>
            <input
              type="date"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
              min={minDateStr}
              className="w-full text-sm text-gray-700 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!content.trim() || !openDate || isLoading}
            className="w-full bg-gradient-to-r from-tianqing to-oupink text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-transform shadow-md"
          >
            {isLoading ? "封存中..." : "封存胶囊"}
          </button>
        </div>
      ) : (
        <div className="flex-1 px-5 py-5 overflow-y-auto">
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="w-full bg-gradient-to-r from-tianqing to-oupink rounded-3xl p-5 text-white shadow-md mb-6 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-base font-semibold mb-1">封存一段时光</h2>
                <p className="text-sm opacity-80">写给未来的自己或家人</p>
              </div>
              <span className="text-4xl leading-none">⏳</span>
            </div>
          </button>

          {unopenedCapsules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-yuebai flex items-center justify-center mb-4 shadow-sm">
                <span className="text-3xl">🌱</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">还没有时光胶囊</p>
              <p className="text-xs text-gray-400 max-w-[220px] leading-6">
                封存此刻的想法或话语<br />在未来的某一天重新打开
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs text-gray-400 font-medium tracking-wider">我的胶囊</h3>

              {unopenedCapsules.map((capsule) => {
                const isOpenable = capsule.status === "sealed" && capsule.openAt <= Date.now();
                const isOpened = capsule.status === "opened";

                return (
                  <button
                    type="button"
                    key={capsule.id}
                    onClick={() => handleOpenCapsule(capsule)}
                    className="w-full bg-white rounded-3xl p-4 border border-gray-100 shadow-sm text-left active:scale-[0.99] transition-transform"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isOpened
                          ? "bg-amber-50"
                          : isOpenable
                            ? "bg-gradient-to-br from-amber-100 to-orange-100"
                            : "bg-yuebai"
                      }`}>
                        <span className="text-2xl leading-none">
                          {isOpened ? "✨" : isOpenable ? "⏳" : "🔒"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-700 truncate">
                            {capsule.content.slice(0, 20)}{capsule.content.length > 20 ? "..." : ""}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                            isOpened
                              ? "bg-amber-100 text-amber-600"
                              : isOpenable
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-500"
                          }`}>
                            {isOpened ? "已开启" : isOpenable ? "可开启" : "未到期"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {isOpened
                            ? `${new Date(capsule.openAt).toLocaleDateString("zh-CN")} 开启`
                            : `将于 ${new Date(capsule.openAt).toLocaleDateString("zh-CN")} 解锁`}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {userType === "parent" && (
            <div className="mt-8 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <h3 className="font-medium text-gray-700 text-sm">使用建议</h3>
              </div>
              <p className="text-xs text-gray-400 leading-6">
                和孩子一起写下对彼此的期望和祝福，约定一个特别的日期一起开启，增进彼此的理解。
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
