import Counter from "./Counter";
import { Reveal } from "./Reveal";
import { stats } from "@/lib/data";

export default function Stats() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="border-l hairline pl-6">
          <p className="font-display text-6xl md:text-7xl font-light text-stone leading-none"><Counter value={s.value} suffix={s.suffix} /></p>
          <p className="mt-4 text-xs tracking-[0.25em] uppercase text-mist">{s.label}</p>
        </Reveal>
      ))}
    </section>
  );
}
