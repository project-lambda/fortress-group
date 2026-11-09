"use client";
import { Bath, BedDouble, Building2, Car, Compass, Dumbbell, Flame, Home, LandPlot, LayoutGrid, MapPin, Route, Ruler, ShieldCheck, Sparkles, Waves, Wind, Zap, Baby, Trees, Users, Cctv, ArrowUpDown, Utensils, ChefHat, Sofa, Droplets, Store, Footprints, DoorOpen, Landmark, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import type { Fact, ParsedProject } from "@/lib/specs";

const FACT_ICON: Record<string, LucideIcon> = { area: Ruler, bedrooms: BedDouble, bathrooms: Bath, balconies: Wind, structure: Building2, units: LayoutGrid, parking: Car, land: LandPlot, facing: Compass, road: Route, towers: Landmark, flatsPerTower: Home, totalFlats: Home, address: MapPin };

const AMENITY_ICON: [RegExp, LucideIcon][] = [
  [/bedroom/i, BedDouble], [/bathroom|bath/i, Bath], [/balcon/i, Wind], [/living/i, Sofa], [/dining/i, Utensils], [/kitchen/i, ChefHat],
  [/pool|water/i, Waves], [/gym|health/i, Dumbbell], [/bbq/i, Flame], [/community|lounge/i, Users], [/prayer/i, Sparkles], [/kids/i, Baby],
  [/park|walkway|recreation|badminton/i, Trees], [/shop/i, Store], [/changing|washroom/i, DoorOpen], [/cctv|guard/i, Cctv], [/lift/i, ArrowUpDown],
  [/generator|substation/i, Zap], [/ev charg/i, Zap], [/stair/i, Footprints], [/car wash/i, Droplets], [/office/i, ShieldCheck],
];
const iconFor = (s: string) => AMENITY_ICON.find(([re]) => re.test(s))?.[1] ?? Sparkles;
const GROUP_ACCENT = { inside: "from-gold/25", lifestyle: "from-emerald-400/20", safety: "from-sky-400/20" } as const;

export default function ProjectSpecs({ parsed, fallbackArea }: { parsed: ParsedProject; fallbackArea: string | null }) {
  const facts = parsed.facts.map((f): Fact => {
    if (f.key === "address" && /[ঀ-৿]/.test(f.value)) return { ...f, value: `${f.value.match(/Block:?\s*([^,]+)/) ? "Block A, " : ""}${fallbackArea ?? "Dhaka"}` };
    if (/^\d+$/.test(f.value)) return { ...f, value: String(parseInt(f.value, 10)) };
    return f;
  });
  const headline = facts.filter((f) => ["area", "bedrooms", "bathrooms", "balconies", "parking", "units"].includes(f.key));
  const rest = facts.filter((f) => !headline.includes(f));

  return (
    <div className="space-y-16">
      {headline.length > 0 && (
        <Reveal>
          <p className="eyebrow mb-5">At a glance</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {headline.map((f) => { const I = FACT_ICON[f.key] ?? Sparkles; return (
              <div key={f.key} className="group relative overflow-hidden rounded-sm border hairline bg-ink-2 p-5 hover:border-gold/40 transition-colors">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                <I size={18} className="text-gold mb-4" />
                <p className="font-display text-3xl font-light leading-none">{f.value}</p>
                <p className="mt-2 text-[10px] tracking-[0.25em] uppercase text-mist">{f.label}</p>
              </div>
            ); })}
          </div>
        </Reveal>
      )}

      {rest.length > 0 && (
        <Reveal delay={0.1}>
          <p className="eyebrow mb-5">Site & building</p>
          <dl className="divide-y hairline border-y hairline">
            {rest.map((f) => { const I = FACT_ICON[f.key] ?? Sparkles; return (
              <div key={f.key} className="grid grid-cols-[20px_140px_1fr] sm:grid-cols-[20px_200px_1fr] items-start gap-4 py-4 text-sm">
                <I size={16} className="text-gold mt-0.5" />
                <dt className="text-mist">{f.label}</dt>
                <dd className="text-stone">{f.value}</dd>
              </div>
            ); })}
          </dl>
        </Reveal>
      )}

      {parsed.groups.length > 0 && (
        <div>
          <Reveal><p className="eyebrow mb-5">Features & amenities</p></Reveal>
          <div className={`grid gap-5 ${parsed.groups.length === 1 ? "" : parsed.groups.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {parsed.groups.map((g, gi) => (
              <Reveal key={g.key} delay={gi * 0.1} className={`relative overflow-hidden rounded-sm border hairline bg-gradient-to-b ${GROUP_ACCENT[g.key]} to-transparent p-6`}>
                <p className="font-display text-2xl leading-tight">{g.title}</p>
                <p className="mt-1 text-xs text-mist">{g.subtitle}</p>
                <ul className="mt-6 space-y-3">
                  {g.items.map((it) => { const I = iconFor(it); return (
                    <li key={it} className="flex items-center gap-3 text-sm text-stone/85">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border hairline bg-ink/60 text-gold"><I size={14} /></span>
                      {it}
                    </li>
                  ); })}
                </ul>
                <span className="absolute right-5 top-5 font-display text-5xl text-stone/10">{String(g.items.length).padStart(2, "0")}</span>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {parsed.note && <Reveal><p className="text-xs text-mist border-l-2 border-gold/40 pl-4 leading-relaxed">Note: {parsed.note}</p></Reveal>}
    </div>
  );
}
