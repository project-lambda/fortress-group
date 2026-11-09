"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";

type Theme = "dark" | "light";
const KEY = "fg:theme";

function read(): Theme { return document.documentElement.dataset.theme === "light" ? "light" : "dark"; }
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

const STARS = Array.from({ length: 14 }, (_, i) => ({ x: (i * 67) % 100, y: (i * 37) % 55, d: (i % 5) * 0.12, s: 1 + (i % 3) }));

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const [sky, setSky] = useState<Theme | null>(null);
  const light = theme === "light";

  const flip = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = read() === "light" ? "dark" : "light";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (reduced || !doc.startViewTransition) { apply(); return; }
    const x = e.clientX, y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    setSky(next);
    setTimeout(() => setSky(null), 1500);
    const t = doc.startViewTransition(apply);
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 1100, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }, []);

  return (
    <>
      <button onClick={flip} aria-label={light ? "Switch to night mode" : "Switch to day mode"} aria-pressed={light} title={light ? "Night" : "Day"} className={`group relative grid h-11 w-11 place-items-center rounded-full border border-fg/25 bg-ink/40 backdrop-blur text-stone hover:border-gold/60 hover:text-gold-2 transition-colors overflow-hidden ${className}`}>
        <motion.svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" animate={{ rotate: light ? 0 : -40 }} transition={{ type: "spring", stiffness: 160, damping: 18 }}>
          <mask id="fg-moon-mask">
            <rect width="24" height="24" fill="white" />
            {/* the moon's bite slides in when it is night */}
            <motion.circle r="7.5" fill="black" animate={light ? { cx: 30, cy: -6 } : { cx: 16, cy: 7 }} transition={{ type: "spring", stiffness: 160, damping: 20 }} />
          </mask>
          <motion.circle cx="12" cy="12" fill="currentColor" mask="url(#fg-moon-mask)" animate={{ r: light ? 4.2 : 7 }} transition={{ type: "spring", stiffness: 160, damping: 18 }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line key={i} x1="12" y1="2.5" x2="12" y2="5" transform={`rotate(${i * 45} 12 12)`} animate={{ opacity: light ? 1 : 0, scale: light ? 1 : 0.4 }} style={{ transformOrigin: "12px 12px" }} transition={{ delay: light ? 0.15 + i * 0.03 : 0, duration: 0.35 }} />
          ))}
        </motion.svg>
      </button>

      {/* day ⇄ night sky pass: sun sets as the moon rises (or the reverse) */}
      <AnimatePresence>
        {sky && (
          <motion.div key={sky} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.55, 0] }} transition={{ duration: 1.4, times: [0, 0.4, 1] }} className={`absolute inset-0 ${sky === "light" ? "bg-[radial-gradient(ellipse_at_50%_110%,rgba(255,196,120,0.9),rgba(255,140,90,0.35)_40%,transparent_70%)]" : "bg-[radial-gradient(ellipse_at_50%_-10%,rgba(40,60,120,0.8),rgba(10,14,40,0.5)_45%,transparent_75%)]"}`} />
            {sky === "dark" && STARS.map((st, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6] }} transition={{ duration: 1.2, delay: 0.2 + st.d, times: [0, 0.4, 1] }} className="absolute rounded-full bg-white" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, boxShadow: "0 0 6px rgba(255,255,255,0.9)" }} />
            ))}
            {/* sun */}
            <motion.div initial={sky === "light" ? { x: "-20vw", y: "60vh", opacity: 0 } : { x: "50vw", y: "12vh", opacity: 1 }} animate={sky === "light" ? { x: "50vw", y: "12vh", opacity: [0, 1, 1, 0] } : { x: "120vw", y: "60vh", opacity: [1, 1, 0] }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} className="absolute -ml-10 -mt-10 h-20 w-20 rounded-full" style={{ background: "radial-gradient(circle at 40% 40%, #ffe9a8, #f3b24a 60%, rgba(243,178,74,0) 72%)", boxShadow: "0 0 80px 30px rgba(255,190,90,0.45)" }} />
            {/* moon */}
            <motion.div initial={sky === "dark" ? { x: "120vw", y: "60vh", opacity: 0 } : { x: "50vw", y: "12vh", opacity: 1 }} animate={sky === "dark" ? { x: "50vw", y: "12vh", opacity: [0, 1, 1, 0] } : { x: "-20vw", y: "60vh", opacity: [1, 1, 0] }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} className="absolute -ml-8 -mt-8 h-16 w-16 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, #ffffff, #cfd6e4 65%)", boxShadow: "inset -14px -6px 0 0 rgba(20,30,60,0.9), 0 0 60px 20px rgba(200,215,255,0.35)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
