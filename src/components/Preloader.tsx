"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const skip = sessionStorage.getItem("fg-loaded");
    let n = 0;
    const finish = () => { setDone(true); sessionStorage.setItem("fg-loaded", "1"); };
    if (skip) { const t = setTimeout(finish, 0); return () => clearTimeout(t); }
    const id = setInterval(() => {
      n += Math.max(1, Math.round((100 - n) / 8));
      if (n >= 100) { n = 100; clearInterval(id); setTimeout(finish, 350); }
      setCount(n);
    }, 40);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <p className="eyebrow mb-4">Fortress Group</p>
            <h1 className="font-display text-5xl md:text-7xl font-light tracking-tight">Building <em className="text-gold">Trust</em></h1>
          </motion.div>
          <div className="absolute bottom-10 left-8 right-8 flex items-end justify-between">
            <span className="font-display text-6xl font-light tabular-nums text-stone/80">{count}</span>
            <div className="h-px flex-1 mx-6 mb-4 bg-white/10 relative overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${count}%` }} />
            </div>
            <span className="eyebrow mb-4">Dhaka · Bangladesh</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
