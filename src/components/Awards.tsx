import Image from "next/image";
import { Reveal } from "./Reveal";
import { awards, concerns } from "@/lib/data";

export default function Awards() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid lg:grid-cols-2 gap-16">
      <div>
        <Reveal><p className="eyebrow mb-4">Awards & recognitions</p><h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-10">Recognised for <em className="text-gold">quality</em></h2></Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {awards.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08} className="group relative aspect-square rounded-sm border hairline bg-ink-2 p-5 flex items-center justify-center hover:border-gold/50 transition-colors">
              {a.image && <Image src={a.image} alt={a.title} fill sizes="200px" className="object-contain p-5" />}
            </Reveal>
          ))}
        </div>
      </div>
      <div>
        <Reveal><p className="eyebrow mb-4">Our concerns</p><h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-10">One group, many <em className="text-gold">ventures</em></h2></Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {concerns.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08} className="group relative aspect-square rounded-sm border hairline bg-white p-5 flex items-center justify-center hover:border-gold/50 transition-colors">
              {c.image && <Image src={c.image} alt={c.title} fill sizes="200px" className="object-contain p-6" />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
