import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

export function getAQIColor(aqi: number): {
  color: string;
  bgLight: string;
  borderColor: string;
  category: string;
  textColor: string;
} {
  if (aqi <= 50) {
    return {
      color: "#10b981", // Emerald
      bgLight: "bg-emerald-50",
      borderColor: "border-emerald-200",
      category: "Good",
      textColor: "text-emerald-700",
    };
  } else if (aqi <= 100) {
    return {
      color: "#f59e0b", // Amber
      bgLight: "bg-amber-50",
      borderColor: "border-amber-200",
      category: "Moderate",
      textColor: "text-amber-700",
    };
  } else if (aqi <= 150) {
    return {
      color: "#f97316", // Orange
      bgLight: "bg-orange-50",
      borderColor: "border-orange-200",
      category: "Unhealthy for Sensitive Groups",
      textColor: "text-orange-700",
    };
  } else if (aqi <= 200) {
    return {
      color: "#ef4444", // Red
      bgLight: "bg-red-50",
      borderColor: "border-red-200",
      category: "Unhealthy",
      textColor: "text-red-700",
    };
  } else if (aqi <= 300) {
    return {
      color: "#8b5cf6", // Purple
      bgLight: "bg-purple-50",
      borderColor: "border-purple-200",
      category: "Very Unhealthy",
      textColor: "text-purple-700",
    };
  } else {
    return {
      color: "#881337", // Maroon / Hazardous
      bgLight: "bg-rose-100",
      borderColor: "border-rose-400",
      category: "Hazardous",
      textColor: "text-rose-900",
    };
  }
}
