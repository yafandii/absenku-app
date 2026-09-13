import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  variant = "primary",
  disabled,
  className = "",
  ...props
}) => {
  const baseStyle =
    "w-full py-3 px-4 font-semibold rounded-xl transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/25",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText || "Memproses..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
