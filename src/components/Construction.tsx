"use client";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "./Reveal";
import type { Structure } from "@/lib/specs";

const W = 230, D = 160, H = 24; // footprint & floor height (px)

const STAGES = [
  { from: 0.0, title: "Foundation", body: "Soil testing, piling and a reinforced raft foundation. Everything above depends on what nobody will ever see." },
  { from: 0.18, title: "Structure", body: "Floor by floor, the RCC frame climbs. Columns, beams and slabs poured to RAJUK-approved drawings." },
  { from: 0.62, title: "Façade & finishing", body: "Brickwork, plaster, premium tiles, fittings and glass. The building earns its face." },
  { from: 0.86, title: "Handover", body: "Lights on. Keys in hand. A Fortress address, ready for the families who will call it home." },
];

const WINDOWS = (dark: string) => ({
  backgroundImage: `repeating-linear-gradient(90deg, transparent 0 10px, ${dark} 10px 24px, transparent 24px 34px)`,
  maskImage: "linear-gradient(180deg, transparent 0 7px, #000 7px 21px, transparent 21px 100%)",
  WebkitMaskImage: "linear-gradient(180deg, transparent 0 7px, #000 7px 21px, transparent 21px 100%)",
});

function Facade({ w, h, base, lit, glass }: { w: number; h: number; base: string; lit: MotionValue<number>; glass: string }) {
  return (
    <div className="absolute inset-0" style={{ width: w, height: h, background: base, borderBottom: "1px solid rgba(0,0,0,.18)" }}>
      <div className="absolute inset-0" style={WINDOWS(glass)} />
      <motion.div className="absolute inset-0" style={{ opacity: lit, ...WINDOWS("rgba(190,255,225,.95)"), filter: "drop-shadow(0 0 6px rgba(120,230,180,.9))" }} />
    </div>
  );
}

function Floor({ i, n, progress, lit, below = false }: { i: number; n: number; progress: MotionValue<number>; lit: MotionValue<number>; below?: boolean }) {
  const start = below ? 0.03 + i * 0.05 : 0.18 + (i / n) * 0.62;
  const end = start + (below ? 0.07 : 0.62 / n + 0.035);
  const drop = useTransform(progress, [start, end], [-520, 0]);
  const op = useTransform(progress, [start, start + 0.015], [0, 1]);
  const level = below ? i + 1 : -i;
  const top = below ? "#3a3f48" : "#efe9df";
  const front = below ? "#2c3038" : "#d6cfc2";
  const side = below ? "#23272e" : "#b1a99c";
  const back = below ? "#1d2026" : "#8f887c";
  const glass = below ? "rgba(0,0,0,.35)" : "rgba(28,32,40,.75)";
  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x: -W / 2, y: drop, opacity: op, marginTop: level * H - H / 2, width: W, height: H, transformStyle: "preserve-3d" }}>
      <motion.div className="absolute inset-0" style={{ z: D / 2, transformStyle: "preserve-3d" }}><Facade w={W} h={H} base={front} glass={glass} lit={lit} /></motion.div>
      <motion.div className="absolute inset-0" style={{ rotateY: 180, z: D / 2, background: back }} />
      <motion.div className="absolute top-0 left-0" style={{ width: D, height: H, x: W - D / 2, rotateY: 90, z: 0, transformStyle: "preserve-3d" }}><Facade w={D} h={H} base={side} glass={glass} lit={lit} /></motion.div>
      <motion.div className="absolute top-0 left-0" style={{ width: D, height: H, x: -D / 2, rotateY: -90, background: back }} />
      <motion.div className="absolute top-0 left-0" style={{ width: W, height: D, y: -(D - H) / 2, rotateX: 90, z: 0, background: top, outline: "1px solid rgba(0,0,0,.06)" }} />
    </motion.div>
  );
}

export default function Construction({ structure, title, eyebrow = "How a Fortress rises" }: { structure?: Structure | null; title?: React.ReactNode; eyebrow?: string }) {
  const n = Math.min(structure?.floors ?? 16, 22);
  const basements = structure?.basements ?? 2;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.3 });
  const rotY = useTransform(progress, [0, 1], [-32, -58]);
  const rotX = useTransform(progress, [0, 1], [26, 22]);
  const lift = useTransform(progress, [0.18, 0.86], [-60, (n * H) / 2 - 110]);
  const slab = useTransform(progress, [0, 0.05], [0.2, 1]);
  const slabOp = useTransform(progress, [0, 0.05], [0, 1]);
  const core = useTransform(progress, [0.14, 0.82], [0, 1]);
  const lit = useTransform(progress, [0.87, 0.97], [0, 1]);
  const crown = useTransform(progress, [0.83, 0.9], [0, 1]);
  const crownDrop = useTransform(progress, [0.83, 0.9], [-260, 0]);
  const glow = useTransform(progress, [0.87, 1], [0, 0.5]);
  const [stage, setStage] = useState(0);
  useMotionValueEvent(progress, "change", (v) => { const s = STAGES.reduce((acc, st, i) => (v >= st.from ? i : acc), 0); if (s !== stage) setStage(s); });
  const pct = useTransform(progress, (v) => `${Math.max(0, Math.min(100, Math.round(v * 100)))}%`);

  return (
    <section ref={ref} className="relative h-[320vh] bg-ink-2">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(31,154,122,0.08),transparent_60%)]" />
        <motion.div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(56,176,128,0.35),transparent_55%)]" style={{ opacity: glow }} />
        <div className="relative mx-auto grid h-full max-w-[1600px] grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-center px-5 md:px-10 gap-8">
          <div className="pt-24 lg:pt-0 z-10">
            <Reveal><p className="eyebrow mb-6">{eyebrow}</p></Reveal>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1]">{title ?? <>From the first pile to the <em className="text-gold">rooftop</em></>}</h2>
            <div className="mt-10 relative h-40">
              {STAGES.map((s, i) => (
                <motion.div key={s.title} className="absolute inset-0" initial={false} animate={{ opacity: stage === i ? 1 : 0, y: stage === i ? 0 : stage > i ? -16 : 16 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Stage 0{i + 1} — {s.title}</p>
                  <p className="text-stone/75 leading-relaxed max-w-md">{s.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10 relative overflow-hidden"><motion.div className="absolute inset-y-0 left-0 right-0 bg-gold" style={{ scaleX: progress, transformOrigin: "left" }} /></div>
              <motion.span className="font-display text-3xl tabular-nums text-stone/80 w-16 text-right">{pct}</motion.span>
            </div>
            {structure && <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-mist">{structure.code} · {n} floors{basements ? ` · ${basements} basement${basements > 1 ? "s" : ""}` : ""}</p>}
          </div>

          <div className="relative h-[55vh] lg:h-full scale-[0.55] sm:scale-75 lg:scale-100 origin-center" style={{ perspective: 2400 }}>
            <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateX: rotX, rotateY: rotY, y: lift }}>
              {/* ground: a flat plate lying at level 0 */}
              <motion.div className="absolute left-1/2 top-1/2" style={{ width: W * 2.2, height: D * 2.2, x: -W * 1.1, y: -D * 1.1, rotateX: 90, scale: slab, opacity: slabOp, marginTop: H / 2, background: "radial-gradient(ellipse at center, rgba(31,154,122,.16), rgba(20,23,28,0) 68%)", outline: "1px solid rgba(31,154,122,.28)", outlineOffset: -36 }} />
              {/* lift core rises ahead of the floors */}
              <motion.div className="absolute left-1/2 top-1/2" style={{ width: 26, height: n * H, x: -13, y: -n * H + H / 2, z: -10, scaleY: core, transformOrigin: "bottom", background: "linear-gradient(180deg, rgba(31,154,122,.95), rgba(31,154,122,.3))", boxShadow: "0 0 24px rgba(31,154,122,.25)" }} />
              {Array.from({ length: basements }).map((_, i) => <Floor key={`b${i}`} i={i} n={basements} progress={progress} lit={lit} below />)}
              {Array.from({ length: n }).map((_, i) => <Floor key={i} i={i} n={n} progress={progress} lit={lit} />)}
              {/* rooftop crown */}
              <motion.div className="absolute left-1/2 top-1/2" style={{ width: W * 0.55, height: D * 0.55, x: -W * 0.275, y: crownDrop, opacity: crown, marginTop: -(n - 1) * H - H / 2 - (D * 0.55) / 2 - 6, rotateX: 90, background: "linear-gradient(135deg,#38b080,#1f9a7a)", boxShadow: "0 0 50px rgba(56,176,128,.7)" }} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
