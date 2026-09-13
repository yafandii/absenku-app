import React from "react";

interface AlertProps {
  message: string;
  type?: "error" | "warning" | "success" | "info";
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  type = "error",
  className = "",
  onClose,
}) => {
  const styles = {
    error: "bg-rose-50 border-rose-200 text-rose-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div
      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2.5 ${styles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity p-0.5 cursor-pointer flex-shrink-0"
          aria-label="Tutup pesan"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
