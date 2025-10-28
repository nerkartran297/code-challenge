interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Toast component - Hiển thị thông báo
 */
export const Toast = ({
  message,
  type = "info",
  isOpen,
  onClose,
}: ToastProps) => {
  if (!isOpen) return null;

  const bgColor =
    type === "error"
      ? "bg-gradient-to-br from-red-600/90 to-red-700/90"
      : type === "success"
      ? "bg-gradient-to-br from-green-600/90 to-green-700/90"
      : "bg-gradient-to-br from-blue-600/90 to-blue-700/90";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideInRight_0.4s_ease-out]">
      <div
        className={`${bgColor} backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[420px] border border-white/10 hover:border-white/20 transition-all`}
      >
        {type === "error" && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-700/30">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-red-100"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        )}
        {type === "success" && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700/30">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-green-100"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {type === "info" && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700/30">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-blue-100"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        )}
        <span className="flex-1 font-medium text-sm leading-snug">
          {message}
        </span>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-lg p-1.5 transition-all hover:rotate-90 duration-300"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};
