import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Reveal, ImageReveal, SplitWords } from "@/components/Reveal";
import Stats from "@/components/Stats";
import Awards from "@/components/Awards";
import CTA from "@/components/CTA";
import Marquee from "@/components/Marquee";
import { ABOUT_LINKS, company, directors, values } from "@/lib/data";
import SubNav from "@/components/SubNav";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const chairman = directors.find((d) => /Chairman/i.test(d.role))!;
  return (
    <>
      <PageHeader eyebrow="About Fortress Group" title="Built on" accent="trust." image="/images/Light-House.jpg">
        {company.about}
      </PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <Marquee items={company.sisterConcerns} />
      <Stats />

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid lg:grid-cols-2 gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <Reveal><p className="eyebrow mb-6">Our story</p></Reveal>
          <h2 className="font-display text-5xl md:text-6xl font-light leading-[1.02]"><SplitWords text="Two decades of shaping" /> <em className="text-gold"><SplitWords text="Dhaka's skyline." delay={0.3} /></em></h2>
          <Reveal delay={0.3} className="mt-8 space-y-5 text-stone/75 leading-relaxed">
            <p>Founded by Md. Gious Uddin, Fortress Holdings Ltd. and Fortress Real Estate Ltd. set out with a simple mission: to create high-quality, exclusive apartment complexes in the prime locations of Dhaka and other major cities of Bangladesh.</p>
            <p>Today the group spans real estate, home solutions, agro farms, trading and a foundation — united by the same promise to every customer: transparency, integrity and excellence in all endeavours.</p>
          </Reveal>
        </div>
        <div className="grid gap-6">
          <ImageReveal className="relative aspect-[4/3] rounded-sm"><Image src="/images/Snowfall.jpg" alt="Fortress Snowfall" fill sizes="50vw" className="object-cover" /></ImageReveal>
          <div className="grid grid-cols-2 gap-6">
            <ImageReveal delay={0.1} className="relative aspect-[3/4] rounded-sm"><Image src="/images/SP.jpg" alt="Syngenis Park" fill sizes="25vw" className="object-cover" /></ImageReveal>
            <ImageReveal delay={0.2} className="relative aspect-[3/4] rounded-sm"><Image src="/images/Marjan.jpg" alt="Marjan Palace" fill sizes="25vw" className="object-cover" /></ImageReveal>
          </div>
        </div>
      </section>

      <section className="bg-sand text-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            <Reveal><p className="eyebrow mb-4">Mission</p><p className="font-display text-2xl md:text-3xl leading-snug">{company.mission}</p></Reveal>
            <Reveal delay={0.1}><p className="eyebrow mb-4">Vision</p><p className="font-display text-2xl md:text-3xl leading-snug">{company.vision}</p></Reveal>
            <Reveal delay={0.2} className="relative aspect-[4/3] lg:aspect-auto rounded-sm overflow-hidden"><Image src="/images/Purbachal.jpg" alt="" fill sizes="33vw" className="object-cover" /></Reveal>
          </div>
          <Reveal className="flex items-end justify-between gap-4 mb-8"><p className="eyebrow">Values</p><Link href="/about/mission" className="link-underline text-xs tracking-[0.3em] uppercase text-ink/70">All seven values</Link></Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.slice(0, 4).map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08} className="border-t border-ink/15 pt-6">
                <p className="font-display text-4xl text-gold mb-2">0{i + 1}</p>
                <h3 className="font-display text-2xl mb-3">{v.t}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
        <ImageReveal className="relative aspect-[3/4] rounded-sm max-w-md">
          {chairman.image && <Image src={chairman.image} alt={chairman.name} fill sizes="40vw" className="object-cover object-top" />}
        </ImageReveal>
        <div>
          <Reveal><p className="eyebrow mb-6">Chairman&apos;s message</p></Reveal>
          <Reveal delay={0.1}><blockquote className="font-display text-3xl md:text-4xl font-light leading-snug">&ldquo;{chairman.bio[chairman.bio.length - 1]}&rdquo;</blockquote></Reveal>
          <Reveal delay={0.2} className="mt-8 space-y-4 text-stone/75 leading-relaxed">{chairman.bio.slice(0, 2).map((t, i) => <p key={i}>{t}</p>)}</Reveal>
          <Reveal delay={0.3} className="mt-8">
            <p className="font-display text-2xl">{chairman.name}</p>
            <p className="text-xs tracking-[0.25em] uppercase text-mist mt-1">{chairman.role}</p>
            <Link href={`/team/${chairman.slug}`} className="link-underline mt-5 inline-block text-xs tracking-[0.3em] uppercase text-gold">Full profile</Link>
          </Reveal>
        </div>
      </section>

      <Awards />
      <CTA image="/images/Tilottama.jpg" />
    </>
  );
}
