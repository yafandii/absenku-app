import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "py-6 px-3",
    md: "py-7 sm:py-8 px-4",
    lg: "py-12 sm:py-16 px-6",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-200/90 ${sizeClasses[size]} ${className}`}
    >
      {icon && (
        <div className="mb-3 flex items-center justify-center">{icon}</div>
      )}
      <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
};
