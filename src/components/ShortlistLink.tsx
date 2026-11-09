"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useShortlist } from "@/lib/shortlist";

export default function ShortlistLink({ className = "" }: { className?: string }) {
  const { slugs } = useShortlist();
  const n = slugs.length;
  return (
    <Link href="/shortlist" aria-label={`Shortlist, ${n} projects`} className={`relative grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-ink/40 backdrop-blur text-stone hover:border-gold/60 hover:text-gold-2 transition-colors ${className}`}>
      <Heart size={16} className={n ? "fill-gold text-gold" : ""} />
      <AnimatePresence>
        {n > 0 && (
          <motion.span key={n} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-medium text-ink">
            {n}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
