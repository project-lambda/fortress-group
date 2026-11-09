"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { AmenityGroup, Fact, Structure } from "@/lib/specs";
import { Reveal } from "./Reveal";

type Kind = "roof" | "floor" | "mezz" | "ground" | "basement";
interface Level { id: string; short: string; name: string; kind: Kind; desc: string; items: string[]; h: number }

const H: Record<Kind, number> = { roof: 12, floor: 16, mezz: 15, ground: 24, basement: 17 };
const ROOF_RE = /bbq|walkway|pool|mini park|water body|badminton/i;
const GROUND_RE = /lounge|guard|office|mini shop|washroom|lift/i;
const BASE_RE = /ev charg|generator|substation|car wash/i;

export function buildLevels(s: Structure, facts: Fact[], groups: AmenityGroup[], size: number | null, towers: number): Level[] {
  const f = (k: string) => facts.find((x) => x.key === k)?.value;
  const lifestyle = groups.find((g) => g.key === "lifestyle")?.items ?? [];
  const safety = groups.find((g) => g.key === "safety")?.items ?? [];
  const inside = groups.find((g) => g.key === "inside")?.items ?? [];
  const roofItems = lifestyle.filter((i) => ROOF_RE.test(i));
  const commItems = lifestyle.filter((i) => !ROOF_RE.test(i));
  const groundItems = safety.filter((i) => GROUND_RE.test(i));
  const baseItems = safety.filter((i) => BASE_RE.test(i));
  const units = f("units");
  const beds = inside.filter((i) => /bed|bath|balcon/i.test(i));
  const sizeTxt = size ? `${size.toLocaleString()} sft` : f("area");

  const out: Level[] = [];
  out.push({ id: "roof", short: "R", name: "Rooftop", kind: "roof", h: H.roof, desc: roofItems.length ? "Open-air community level above the city." : "Open rooftop terrace planned for residents' use.", items: roofItems.length ? roofItems : ["Rooftop garden", "Open terrace"] });
  for (let i = s.floors; i >= 1; i--) {
    out.push({
      id: `f${i}`, short: String(i), name: `Level ${i}`, kind: "floor", h: H.floor,
      desc: `${i === s.floors ? "Top residential floor" : i === 1 ? "First residential floor" : "Typical residential floor"}${units ? ` · ${units} apartments` : ""}${towers > 1 ? ` in each of ${towers} towers` : ""}.`,
      items: [sizeTxt ? `${sizeTxt} apartments` : "Apartments", ...beds].filter(Boolean) as string[],
    });
  }
  if (s.mezzanine) out.push({ id: "mezz", short: "M", name: "Mezzanine", kind: "mezz", h: H.mezz, desc: "Shared amenities for the whole community.", items: commItems.length ? commItems : ["Community hall", "Gym", "Prayer room"] });
  if (s.ground) out.push({ id: "ground", short: "G", name: "Ground floor", kind: "ground", h: H.ground, desc: "Double-height entrance lobby, driveway and reception.", items: ["Entrance lobby", ...(groundItems.length ? groundItems : ["Reception", "Guard room"]), ...(!s.mezzanine && commItems.length ? commItems : [])] });
  for (let b = 1; b <= s.basements; b++) {
    const parking = f("parking");
    out.push({ id: `b${b}`, short: `B${b}`, name: `Basement ${b}`, kind: "basement", h: H.basement, desc: parking ? `Secure car parking · ${parking} bays across ${s.basements} level${s.basements > 1 ? "s" : ""}.` : "Secure car parking for residents and visitors.", items: ["Car parking", ...(b === 1 ? baseItems : []), ...(b === s.basements ? ["Water reservoir", "Pump room"] : [])] });
  }
  return out;
}

export default function FloorSelector({ structure, facts, groups, size, towers, name }: { structure: Structure; facts: Fact[]; groups: AmenityGroup[]; size: number | null; towers: number; name: string }) {
  const levels = buildLevels(structure, facts, groups, size, towers);
  const topFloor = levels.findIndex((l) => l.kind === "floor");
  const [active, setActive] = useState(topFloor);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  // Lift ride: from the lowest basement up to the top floor, once, until the user takes over.
  useEffect(() => {
    if (!inView || touched) return;
    let i = levels.length - 1;
    const id = setInterval(() => {
      i -= 1;
      setActive(i);
      if (i <= topFloor) clearInterval(id);
    }, 110);
    return () => clearInterval(id);
  }, [inView, touched, levels.length, topFloor]);

  const pick = (i: number) => { setTouched(true); setActive(Math.max(0, Math.min(levels.length - 1, i))); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); pick(active - 1); }
    if (e.key === "ArrowDown") { e.preventDefault(); pick(active + 1); }
  };

  // geometry
  const W = 260, X0 = 56, X1 = 232, PAD = 18;
  const total = levels.reduce((a, l) => a + l.h, 0) + PAD * 2;
  const rows = levels.reduce<(Level & { y: number })[]>((acc, l) => {
    const prev = acc[acc.length - 1];
    acc.push({ ...l, y: prev ? prev.y + prev.h : PAD });
    return acc;
  }, []);
  const groundY = rows.find((r) => r.kind === "basement")?.y ?? total - PAD;
  const cur = levels[active];

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-5 md:px-10 py-24">
      <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow mb-3">Floor by floor</p>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-none">Ride through <em className="text-gold">{name.replace(/^Fortress /, "")}</em></h2>
        </div>
        <p className="text-sm text-mist max-w-sm">Hover or tap a level on the elevation, or use the arrow keys, to see what lives on each floor of the {structure.code} building.</p>
      </Reveal>

      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-20 items-start">
        <div tabIndex={0} onKeyDown={onKey} aria-label="Building elevation, use arrow keys to change floor" className="outline-none focus-visible:ring-1 focus-visible:ring-gold/60 rounded-sm">
          <svg viewBox={`0 0 ${W} ${total}`} className="w-full max-h-[78vh] select-none" style={{ aspectRatio: `${W}/${total}` }}>
            {/* ground line & sky */}
            <line x1={8} x2={W - 8} y1={groundY} y2={groundY} stroke="var(--color-stone)" strokeOpacity={0.5} strokeWidth={1} />
            <rect x={X0 - 12} y={groundY} width={X1 - X0 + 24} height={total - groundY - PAD / 2} fill="var(--color-fg)" fillOpacity={0.025} />
            {rows.map((r, i) => {
              const on = i === active;
              const isBase = r.kind === "basement";
              return (
                <g key={r.id} onMouseEnter={() => pick(i)} onClick={() => pick(i)} className="cursor-pointer">
                  <rect x={X0} y={r.y} width={X1 - X0} height={r.h} fill="var(--color-gold)" fillOpacity={on ? 0.35 : 0} stroke={on ? "var(--color-gold-2)" : "var(--color-stone)"} strokeOpacity={on ? 1 : isBase ? 0.35 : 0.25} strokeWidth={on ? 1.2 : 0.8} strokeDasharray={isBase ? "3 3" : undefined} />
                  {/* windows / details */}
                  {r.kind === "floor" && Array.from({ length: 6 }).map((_, k) => (
                    <rect key={k} x={X0 + 10 + k * 28} y={r.y + 4} width={16} height={r.h - 8} fill="var(--color-stone)" fillOpacity={on ? 0.9 : 0.18} />
                  ))}
                  {r.kind === "mezz" && Array.from({ length: 3 }).map((_, k) => (
                    <rect key={k} x={X0 + 14 + k * 56} y={r.y + 4} width={44} height={r.h - 8} fill="var(--color-stone)" fillOpacity={on ? 0.9 : 0.14} />
                  ))}
                  {r.kind === "ground" && (<>
                    <rect x={X0 + 70} y={r.y + 5} width={36} height={r.h - 5} fill="var(--color-stone)" fillOpacity={on ? 1 : 0.3} />
                    <rect x={X0 + 12} y={r.y + 6} width={44} height={r.h - 12} fill="var(--color-stone)" fillOpacity={on ? 0.8 : 0.14} />
                    <rect x={X0 + 120} y={r.y + 6} width={44} height={r.h - 12} fill="var(--color-stone)" fillOpacity={on ? 0.8 : 0.14} />
                  </>)}
                  {r.kind === "roof" && (<>
                    <rect x={X0 + 20} y={r.y + 3} width={30} height={r.h - 6} fill="none" stroke="var(--color-stone)" strokeOpacity={on ? 1 : 0.3} strokeWidth={0.8} />
                    <line x1={X0 + 70} x2={X1 - 20} y1={r.y + r.h / 2} y2={r.y + r.h / 2} stroke="var(--color-stone)" strokeOpacity={on ? 1 : 0.3} strokeWidth={0.8} strokeDasharray="2 3" />
                  </>)}
                  {isBase && Array.from({ length: 7 }).map((_, k) => (
                    <rect key={k} x={X0 + 8 + k * 24} y={r.y + 5} width={14} height={r.h - 10} rx={1.5} fill="var(--color-stone)" fillOpacity={on ? 0.75 : 0.12} />
                  ))}
                  {/* label */}
                  {(on || r.kind !== "floor" || Number(r.short) % 4 === 0) && (
                    <text x={X0 - 10} y={r.y + r.h / 2 + 3} textAnchor="end" fontSize={on ? 9 : 7.5} fill={on ? "var(--color-gold-2)" : "var(--color-mist)"} className="font-sans tracking-widest">{r.short}</text>
                  )}
                </g>
              );
            })}
            {/* lift indicator */}
            <motion.g animate={{ y: 0 }}>
              <motion.rect x={X1 + 10} width={6} animate={{ y: rows[active].y, height: rows[active].h }} transition={{ type: "spring", stiffness: 300, damping: 30 }} fill="var(--color-gold)" />
              <line x1={X1 + 13} x2={X1 + 13} y1={PAD} y2={total - PAD} stroke="var(--color-fg)" strokeOpacity={0.12} strokeWidth={1} />
            </motion.g>
          </svg>
        </div>

        <div className="lg:sticky lg:top-32">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => pick(active - 1)} disabled={active === 0} aria-label="Up one level" className="grid h-10 w-10 place-items-center rounded-full border hairline text-stone hover:border-gold/70 hover:text-gold-2 disabled:opacity-30 transition-colors"><ArrowUp size={15} /></button>
            <button onClick={() => pick(active + 1)} disabled={active === levels.length - 1} aria-label="Down one level" className="grid h-10 w-10 place-items-center rounded-full border hairline text-stone hover:border-gold/70 hover:text-gold-2 disabled:opacity-30 transition-colors"><ArrowDown size={15} /></button>
            <span className="ml-2 text-[10px] tracking-[0.3em] uppercase text-mist">{levels.length} levels · {structure.code}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-baseline gap-5">
                <span className="font-display text-[88px] md:text-[128px] leading-none text-gold tabular-nums">{cur.short}</span>
                <div>
                  <p className="eyebrow mb-2">{cur.kind === "floor" ? "Residential" : cur.kind === "basement" ? "Below ground" : cur.kind === "roof" ? "Above all" : "Shared"}</p>
                  <h3 className="font-display text-4xl md:text-5xl font-light leading-none">{cur.name}</h3>
                </div>
              </div>
              <p className="mt-6 text-stone/75 leading-relaxed max-w-md">{cur.desc}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {cur.items.map((it) => <li key={it} className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-stone/90">{it}</li>)}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
