import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: { container: "gap-0.5", text: "text-[7px]", circle: "w-6 h-6", border: "border-[1px]" },
    md: { container: "gap-1", text: "text-[10px]", circle: "w-10 h-10", border: "border-2" },
    lg: { container: "gap-2", text: "text-base", circle: "w-24 h-24", border: "border-4" },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${s.container} ${className}`}>
      <span className={`${s.text} font-black tracking-[0.4em] text-text-primary uppercase leading-none`}>
        Chemnitz
      </span>
      <div className={`${s.circle} rounded-full bg-[#E63946] flex items-center justify-center p-1 shadow-lg shadow-red-500/20`}>
        <div className={`w-full h-full rounded-full ${s.border} border-white/80`} />
      </div>
      <span className={`${s.text} font-black tracking-[0.4em] text-text-primary uppercase leading-none`}>
        Deals
      </span>
    </div>
  );
}
