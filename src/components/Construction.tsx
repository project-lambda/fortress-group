"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Reveal } from "./Reveal";
import type { Structure } from "@/lib/specs";

const WireScene = dynamic(() => import("./wire/WireScene"), { ssr: false });

const STAGES = [
  { from: 0.0, title: "Site & foundation", body: "Boundary wall, roads and services are set out first. Then piling and a reinforced raft, two basements deep." },
  { from: 0.2, title: "Structure", body: "Floor by floor the RCC frame climbs: slabs, blade walls and the glazed core between the towers." },
  { from: 0.62, title: "Façade & balconies", body: "Cantilevered balconies alternate up the towers, each with its own planter. Fins, mullions and glass follow." },
  { from: 0.86, title: "Handover", body: "Rooftop pool and pergola, landscaping, lights on. A Fortress address, ready for the families who will call it home." },
];

export default function Construction({ structure, title, eyebrow = "How a Fortress rises", towers = 1 }: { structure?: Structure | null; title?: React.ReactNode; eyebrow?: string; towers?: number }) {
  const n = Math.min(structure?.floors ?? 16, 24);
  const basements = structure?.basements ?? 2;
  const params = { floors: n, basements, towers: (towers >= 2 ? 2 : 1) as 1 | 2, mezzanine: structure?.mezzanine ?? true };
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.3 });
  const [stage, setStage] = useState(0);
  const stageMV = useTransform(progress, (v) => STAGES.reduce((acc, st, i) => (v >= st.from ? i : acc), 0));
  useMotionValueEvent(stageMV, "change", (s) => setStage((prev) => (prev === s ? prev : s)));
  const pct = useTransform(progress, (v) => `${Math.max(0, Math.min(100, Math.round(v * 100)))}%`);
  const glow = useTransform(progress, [0.88, 1], [0, 0.35]);

  return (
    <section ref={ref} className="relative h-[380vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_55%,rgba(56,176,128,0.35),transparent_55%)]" style={{ opacity: glow }} />
        <div className="absolute inset-y-0 right-0 left-0 lg:left-[18%]">
          <WireScene progress={progress} params={params} />
        </div>
        <div className="absolute inset-y-0 left-0 w-full md:w-[55%] bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
        <div className="relative mx-auto h-full max-w-[1600px] px-5 md:px-10 pointer-events-none">
          <div className="absolute left-5 md:left-10 bottom-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-md pointer-events-auto">
            <Reveal><p className="eyebrow mb-6">{eyebrow}</p></Reveal>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1]">{title ?? <>From the first pile to the <em className="text-gold">rooftop</em></>}</h2>
            <div className="mt-8 relative h-32">
              {STAGES.map((s, i) => (
                <motion.div key={s.title} className="absolute inset-0" initial={false} animate={{ opacity: stage === i ? 1 : 0, y: stage === i ? 0 : stage > i ? -16 : 16 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Stage 0{i + 1} — {s.title}</p>
                  <p className="text-stone/75 text-sm md:text-base leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10 relative overflow-hidden"><motion.div className="absolute inset-y-0 left-0 right-0 bg-gold" style={{ scaleX: progress, transformOrigin: "left" }} /></div>
              <motion.span className="font-display text-3xl tabular-nums text-stone/80 w-16 text-right">{pct}</motion.span>
            </div>
            {structure && <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-mist">{structure.code} · {n} floors{basements ? ` · ${basements} basement${basements > 1 ? "s" : ""}` : ""}{params.towers === 2 ? " · 2 towers" : ""}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
