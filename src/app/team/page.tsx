import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import CTA from "@/components/CTA";
import { directors, experts } from "@/lib/data";

export const metadata: Metadata = { title: "Leadership" };

export default function TeamPage() {
  return (
    <>
      <PageHeader eyebrow="Leadership" title="The people behind" accent="Fortress." image="/images/Signature.jpg">
        A board of seasoned engineers, entrepreneurs and professionals, backed by a sales team that knows every square foot we build.
      </PageHeader>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-24">
        <Reveal><p className="eyebrow mb-10">Board of directors & management</p></Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {directors.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.1}>
              <Link href={`/team/${d.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-3">
                  {d.image && <Image src={d.image} alt={d.name} fill sizes="33vw" className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="absolute bottom-5 left-5 right-5 text-sm text-stone/90 line-clamp-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">{d.bio[0]}</p>
                </div>
                <h3 className="mt-5 font-display text-3xl font-light group-hover:text-gold transition-colors">{d.name}</h3>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-mist">{d.role}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-sand text-ink py-24">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal><p className="eyebrow mb-4">Sales & marketing</p><h2 className="font-display text-5xl font-light mb-12">Our <em className="text-gold">experts</em></h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {experts.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.06}>
                <Link href={`/team/${e.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-stone grayscale group-hover:grayscale-0 transition-all duration-700">
                    {e.image && <Image src={e.image} alt={e.name} fill sizes="20vw" className="object-cover object-top" />}
                  </div>
                  <p className="mt-4 font-display text-lg leading-tight">{e.name}</p>
                  <p className="text-[11px] tracking-wider uppercase text-ink/60 mt-1">{e.role}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA image="/images/Freesia.jpg" />
    </>
  );
}
