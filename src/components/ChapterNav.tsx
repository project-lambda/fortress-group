"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";

export interface Chapter { id: string; label: string }

export default function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6 && window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav aria-label="Chapters" animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 16 }} transition={{ duration: 0.5 }} className={`hidden xl:flex fixed right-7 top-1/2 z-40 -translate-y-1/2 flex-col items-end gap-3 ${visible ? "" : "pointer-events-none"}`}>
      {chapters.map((c, i) => {
        const on = c.id === active;
        return (
          <button key={c.id} onClick={() => go(c.id)} className="group flex items-center gap-3 py-0.5">
            <span className={`text-[10px] tracking-[0.3em] uppercase transition-all duration-500 ${on ? "text-gold-2 opacity-100 translate-x-0" : "text-stone/60 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}>
              <span className="text-mist mr-2">{String(i + 1).padStart(2, "0")}</span>{c.label}
            </span>
            <span className={`block h-px transition-all duration-500 ${on ? "w-8 bg-gold" : "w-4 bg-stone/40 group-hover:w-6 group-hover:bg-stone/70"}`} />
          </button>
        );
      })}
    </motion.nav>
  );
}
