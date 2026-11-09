"use client";

export default function RangeSlider({ min, max, step = 50, value, onChange, format = (v: number) => String(v) }: {
  min: number; max: number; step?: number; value: [number, number]; onChange: (v: [number, number]) => void; format?: (v: number) => string;
}) {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[11px] tracking-wider text-stone/80 mb-2">
        <span>{format(lo)}</span><span>{format(hi)}</span>
      </div>
      <div className="range relative h-5">
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/15" />
        <div className="absolute top-1/2 h-px -translate-y-1/2 bg-gold" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" min={min} max={max} step={step} value={lo} aria-label="Minimum size" onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])} />
        <input type="range" min={min} max={max} step={step} value={hi} aria-label="Maximum size" onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])} />
      </div>
    </div>
  );
}
