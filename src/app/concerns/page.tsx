import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Marquee from "@/components/Marquee";
import CTA from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { company, concernPages } from "@/lib/data";

export const metadata: Metadata = { title: "Our Concerns" };

export default function ConcernsPage() {
  return (
    <>
      <PageHeader eyebrow="Our concerns" title="One group," accent="six concerns." image="/images/Portia.jpg">
        From the holding company and the development arm to agro, trading, home solutions and a foundation, every Fortress concern carries the same promise: build with care.
      </PageHeader>
      <Marquee items={company.sisterConcerns} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concernPages.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.08}>
              <Link href={`/concerns/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-ink-2">
                <Image src={c.hero} alt="" fill sizes="33vw" className="object-cover opacity-40 transition-all duration-1000 group-hover:opacity-60 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase ${c.status === "active" ? "bg-gold text-ink" : "border hairline bg-ink/50 text-stone/80"}`}>{c.status === "active" ? "Active" : "Profile soon"}</span>
                <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/30 text-stone opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"><ArrowUpRight size={16} /></span>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  {c.image ? <div className="relative h-14 w-40 mb-5 rounded-sm bg-stone p-2"><Image src={c.image} alt={c.title} fill sizes="160px" className="object-contain p-2" /></div> : <p className="font-display text-5xl text-gold/70 mb-4">0{i + 1}</p>}
                  <p className="eyebrow mb-2">{c.sector}</p>
                  <h2 className="font-display text-3xl md:text-4xl font-light leading-tight">{c.title}</h2>
                  <p className="mt-2 text-sm text-stone/70">{c.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA image="/images/Freesia.jpg" />
    </>
  );
}
