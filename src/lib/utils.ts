import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactNumber(number: number) {
  if (Math.abs(number) >= 1_000_000) {
    return (number / 1_000_000).toFixed(2) + 'M';
  }
  if (Math.abs(number) >= 1_000) {
     return (number / 1_000).toFixed(2) + 'K';
  }
  return number.toFixed(2);
}
