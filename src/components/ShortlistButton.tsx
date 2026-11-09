"use client";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useShortlist } from "@/lib/shortlist";

export default function ShortlistButton({ slug, className = "", size = 16, label = false }: { slug: string; className?: string; size?: number; label?: boolean }) {
  const { has, toggle } = useShortlist();
  const on = has(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from shortlist" : "Add to shortlist"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      className={`group/heart inline-flex items-center justify-center gap-2 rounded-full border backdrop-blur transition-colors ${on ? "border-gold bg-gold text-ink" : "border-fg/30 bg-ink/40 text-stone hover:border-gold/70 hover:text-gold-2"} ${className}`}
    >
      <motion.span key={String(on)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="grid place-items-center">
        <Heart size={size} className={on ? "fill-current" : ""} />
      </motion.span>
      {label && <span className="text-[11px] tracking-[0.2em] uppercase pr-1">{on ? "Shortlisted" : "Shortlist"}</span>}
    </button>
  );
}
