"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const WORDS = [
  { t: "Build", x: "0%" },
  { t: "With", x: "18%" },
  { t: "Care.", x: "40%", gold: true },
];

// Stylised tower: outline, floor plates, balconies, crown — drawn stroke by stroke
const TOWER = {
  outline: "M60 520 V140 L120 100 L180 140 V520",
  core: "M120 100 V520",
  crown: "M60 140 L120 100 L180 140 M90 120 V160 M150 120 V160 M120 100 V60 M112 60 H128",
  floors: Array.from({ length: 18 }, (_, i) => 170 + i * 19).map((y) => `M60 ${y} H180`).join(" "),
  balconies: Array.from({ length: 9 }, (_, i) => 180 + i * 38).map((y) => `M40 ${y} H60 V${y + 10} H40 Z M180 ${y + 19} H200 V${y + 29} H180 Z`).join(" "),
  windows: Array.from({ length: 17 }, (_, i) => 176 + i * 19).map((y) => `M75 ${y} H105 M135 ${y} H165`).join(" "),
  ground: "M0 520 H240 M20 540 H220",
};

export default function Splash() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t0 = performance.now(); const DUR = 3000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick); else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const stroke = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const draw = (delay: number, dur = 1.6) => ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { pathLength: { delay, duration: dur, ease: [0.65, 0, 0.35, 1] as const }, opacity: { delay, duration: 0.2 } } });

  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="splash" className="fixed inset-0 z-[100]" exit={{ opacity: 0, transition: { duration: 0.2, delay: 1 } }}>
          {/* two curtains that part on exit */}
          <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-ink" exit={{ y: "-100%", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }} />
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" exit={{ y: "100%", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }} />

          <motion.div className="absolute inset-0 flex items-center justify-center" exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5 } }}>
            <div className="relative w-full max-w-[1400px] px-6 md:px-16 grid md:grid-cols-[1fr_auto] items-center gap-10">
              <div className="relative">
                {WORDS.map((w, i) => (
                  <div key={w.t} className="overflow-hidden" style={{ paddingLeft: w.x }}>
                    <motion.p initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.18, duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className={`font-display font-light leading-[0.9] text-[16vw] md:text-[9vw] ${w.gold ? "text-gold italic" : "text-stone"}`}>
                      {w.t}
                    </motion.p>
                  </div>
                ))}
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} className="eyebrow mt-8">Fortress Group · Dhaka</motion.p>
              </div>

              <motion.svg viewBox="0 0 240 560" className="hidden md:block h-[70vh] w-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <motion.path d={TOWER.ground} stroke="rgba(233,228,220,.35)" strokeWidth="1" {...stroke} {...draw(0.1, 0.8)} />
                <motion.path d={TOWER.outline} stroke="#e9e4dc" strokeWidth="1.4" {...stroke} {...draw(0.3, 1.8)} />
                <motion.path d={TOWER.core} stroke="rgba(233,228,220,.4)" strokeWidth="1" {...stroke} {...draw(0.6, 1.4)} />
                <motion.path d={TOWER.floors} stroke="rgba(233,228,220,.5)" strokeWidth="0.8" {...stroke} {...draw(0.9, 1.5)} />
                <motion.path d={TOWER.windows} stroke="rgba(31,154,122,.9)" strokeWidth="1.2" {...stroke} {...draw(1.3, 1.3)} />
                <motion.path d={TOWER.balconies} stroke="#e9e4dc" strokeWidth="1" {...stroke} {...draw(1.5, 1.2)} />
                <motion.path d={TOWER.crown} stroke="#1f9a7a" strokeWidth="1.4" {...stroke} {...draw(2.1, 0.8)} />
                <motion.circle cx="120" cy="52" r="3" fill="#38b080" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.6, 1], opacity: 1 }} transition={{ delay: 2.8, duration: 0.5 }} />
              </motion.svg>
            </div>
          </motion.div>

          <motion.div className="absolute bottom-8 left-6 right-6 md:left-16 md:right-16 flex items-end justify-between" exit={{ opacity: 0 }}>
            <span className="font-display text-6xl md:text-7xl font-light tabular-nums text-stone/80 leading-none">{count}</span>
            <div className="mx-8 mb-4 h-px flex-1 bg-white/10 relative overflow-hidden"><motion.div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${count}%` }} /></div>
            <span className="eyebrow mb-4 hidden sm:block">Since 2004 · ISO certified</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
