"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoLoaderProps {
  className?: string;
  size?: number;
}

export function LogoLoader({ className, size = 40 }: LogoLoaderProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div 
        className="absolute animate-ping rounded-full bg-emerald-500/20" 
        style={{ width: size * 1.5, height: size * 1.5 }} 
      />
      <div className="relative animate-pulse">
        <Image
          src="/logo/logo.png"
          alt="Loading..."
          width={size}
          height={size}
          className="object-contain"
        />
      </div>
    </div>
  );
}
