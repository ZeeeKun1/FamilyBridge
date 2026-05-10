export default function Loading({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="w-6 h-6 border-2 border-tianqing/30 border-t-tianqing rounded-full animate-spin" />
      <span className="text-xs text-gray-400">{text}</span>
    </div>
  );
}
