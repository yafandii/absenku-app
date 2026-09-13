import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white border-t-4 border-t-indigo-600 border-x border-b border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/5 relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
