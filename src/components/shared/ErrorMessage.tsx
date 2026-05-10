export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 px-4">
      <span className="text-2xl">😔</span>
      <p className="text-sm text-gray-500 text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-1.5 text-xs bg-primary text-white rounded-full"
        >
          重试
        </button>
      )}
    </div>
  );
}
