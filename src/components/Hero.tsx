"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

export default function Hero({ slides }: { slides: Project[] }) {
  const [i, setI] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 240]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [slides.length]);
  const s = slides[i];
  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div key={s.slug} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6, ease: "easeInOut" }}>
          <motion.div style={{ y }} className="absolute inset-0">
            <Image src={s.image!} alt={s.name} fill priority sizes="100vw" className="object-cover ken-burns" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 md:px-10 pb-16 md:pb-24">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }} className="eyebrow mb-6">
          Premium residences · Dhaka, Bangladesh
        </motion.p>
        <h1 className="font-display font-light leading-[0.92] tracking-tight text-[13vw] sm:text-[9vw] lg:text-[7.5vw] max-w-5xl">
          {["Where", "Trust", "Becomes"].map((w, k) => (
            <span key={w} className="block overflow-hidden">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 1.3 + k * 0.12, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
                {w}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.em className="block text-gold not-italic font-display italic" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 1.66, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
              Home.
            </motion.em>
          </span>
        </h1>

        <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="max-w-md text-sm md:text-base leading-relaxed text-stone/80">
            Over 35 residential projects across Bashundhara, Jolshiri, Purbachal and beyond — crafted with top-tier construction and premium finishing for more than 500 families.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 1 }} className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="eyebrow mb-1">Now showing</p>
              <AnimatePresence mode="wait">
                <motion.p key={s.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="font-display text-2xl">{s.name} <span className="text-mist text-base">· {s.area}</span></motion.p>
              </AnimatePresence>
            </div>
            <Link href={`/projects/${s.slug}`} className="group inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-all duration-500">
              <ArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          {slides.map((x, k) => (
            <button key={x.slug} aria-label={x.name} onClick={() => setI(k)} className="h-px flex-1 max-w-16 bg-white/20 relative overflow-hidden">
              {k === i && <motion.span key={i} className="absolute inset-y-0 left-0 bg-gold" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6.5, ease: "linear" }} />}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-mist"><ArrowDown size={12} className="animate-bounce" /> Scroll</span>
        </div>
      </motion.div>
    </section>
  );
}
