"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function Reveal({ children, delay = 0, className = "", y = 40 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export function SplitWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
          <motion.span className="inline-block" initial={{ y: "110%" }} animate={inView ? { y: 0 } : {}} transition={{ duration: 0.9, delay: delay + i * 0.05, ease: [0.16, 1, 0.3, 1] }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function ImageReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div ref={ref} className={`overflow-hidden ${className}`} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}} transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div initial={{ scale: 1.25 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }} className="h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  );
}
