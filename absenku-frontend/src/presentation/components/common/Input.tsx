import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightAction,
  error,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`w-full ${
            leftIcon ? "pl-10" : "pl-3.5"
          } ${
            rightAction ? "pr-10" : "pr-3.5"
          } py-2.5 bg-slate-50 border ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
              : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15"
          } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white transition duration-150 ${className}`}
          {...props}
        />
        {rightAction && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
            {rightAction}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
};
