import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
  showText = true,
}) => {
  const config = {
    sm: { img: 22, text: "text-base" },
    md: { img: 28, text: "text-lg" },
    lg: { img: 36, text: "text-2xl" },
  };

  const { img, text } = config[size];

  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <div className="flex-shrink-0">
        <Image
          src="/logo.svg"
          width={img}
          height={img}
          alt="Logo Absenku"
          priority
        />
      </div>
      {showText && (
        <span
          className={`${text} font-black tracking-tight text-slate-900 leading-none`}
        >
          Absen<span className="text-indigo-600">ku</span>
        </span>
      )}
    </div>
  );
};
