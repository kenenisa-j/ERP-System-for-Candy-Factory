// src/components/shared/ErrorMessage.tsx
interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col items-center gap-4">
      <p className="font-medium">⚠️ Error: {message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}