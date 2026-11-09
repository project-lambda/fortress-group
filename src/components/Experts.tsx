import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { experts, company } from "@/lib/data";

export default function Experts() {
  return (
    <section className="bg-sand text-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <Reveal>
            <p className="eyebrow mb-4">Our experts</p>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-none">Talk to someone who <em className="text-gold">knows</em></h2>
          </Reveal>
          <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-sm tracking-wider text-ink/70 hover:text-ink">{company.phone}</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {experts.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.07}>
              <Link href={`/team/${e.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-stone grayscale group-hover:grayscale-0 transition-all duration-700">
                  {e.image && <Image src={e.image} alt={e.name} fill sizes="20vw" className="object-cover object-top group-hover:scale-105 transition-transform duration-1000" />}
                </div>
                <p className="mt-4 font-display text-lg leading-tight">{e.name}</p>
                <p className="text-[11px] tracking-wider uppercase text-ink/60 mt-1">{e.role}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
