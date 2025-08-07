
'use client';

import { cn } from "@/lib/utils";

type PreloaderProps = {
  loading: boolean;
};

export function Preloader({ loading }: PreloaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative h-24 w-24">
        <svg className="absolute h-full w-full" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-primary/20"
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            className="animate-spin-slow stroke-current text-primary"
            style={{ transformOrigin: "50% 50%" }}
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="125.6"
            strokeDashoffset="125.6"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-primary font-headline text-lg">
           SLC
        </div>
      </div>
    </div>
  );
}
