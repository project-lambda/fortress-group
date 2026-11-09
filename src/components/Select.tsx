"use client";
import { ChevronDown } from "lucide-react";

export default function Select({ className = "", wrapClassName = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { wrapClassName?: string }) {
  return (
    <span className={`relative inline-flex items-center ${wrapClassName}`}>
      <select {...props} className={`peer w-full appearance-none bg-transparent pr-9 text-stone outline-none cursor-pointer [&>option]:bg-ink [&>option]:text-stone ${className}`}>
        {children}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 text-gold transition-transform peer-focus:rotate-180" />
    </span>
  );
}
