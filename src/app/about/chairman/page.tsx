import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import CTA from "@/components/CTA";
import { Reveal, ImageReveal } from "@/components/Reveal";
import { ABOUT_LINKS, directors } from "@/lib/data";

export const metadata: Metadata = { title: "Chairman's Message" };

export default function ChairmanPage() {
  const c = directors.find((d) => /Chairman/i.test(d.role))!;
  const quote = c.bio[c.bio.length - 1];
  return (
    <>
      <PageHeader eyebrow="Chairman's message" title="A word from" accent="the chairman." image="/images/Snowfall.jpg" />
      <SubNav links={ABOUT_LINKS} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-24 items-start">
        <div className="lg:sticky lg:top-36">
          <ImageReveal className="relative aspect-square rounded-sm max-w-md"><Image src="/images/Md-Gious-Uddin-Chairman.jpg" alt={c.name} fill sizes="40vw" className="object-cover object-top" priority /></ImageReveal>
          <Reveal delay={0.2} className="mt-6">
            <p className="font-display text-3xl">{c.name}</p>
            <p className="text-xs tracking-[0.25em] uppercase text-mist mt-1">{c.role}</p>
            <Link href={`/team/${c.slug}`} className="link-underline mt-4 inline-block text-xs tracking-[0.3em] uppercase text-gold">Full profile</Link>
          </Reveal>
        </div>
        <div>
          <Reveal><blockquote className="font-display text-3xl md:text-5xl font-light leading-snug text-stone">&ldquo;{quote}&rdquo;</blockquote></Reveal>
          <Reveal delay={0.15} className="mt-12 space-y-6 text-lg text-stone/75 leading-relaxed first-letter:font-display first-letter:text-6xl first-letter:text-gold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8]">
            {c.bio.slice(0, -1).map((t, i) => <p key={i}>{t}</p>)}
          </Reveal>
          <Reveal delay={0.2} className="mt-12 border-t hairline pt-6">
            <p className="font-display text-2xl italic text-gold-2">Build with care.</p>
            <p className="text-xs tracking-[0.25em] uppercase text-mist mt-2">{c.name} · {c.role}</p>
          </Reveal>
        </div>
      </section>
      <CTA image="/images/Tilottama.jpg" />
    </>
  );
}
