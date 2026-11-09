import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import ShowcaseGrid from "@/components/ShowcaseGrid";
import CTA from "@/components/CTA";
import { Reveal, SplitWords } from "@/components/Reveal";
import { concernPages, directors, featuredProjects, getConcern } from "@/lib/data";

export function generateStaticParams() { return concernPages.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getConcern((await params).slug);
  return { title: c?.title ?? "Concern" };
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const c = getConcern((await params).slug);
  if (!c) notFound();
  const idx = concernPages.findIndex((x) => x.slug === c.slug);
  const next = concernPages[(idx + 1) % concernPages.length];
  const chairman = directors.find((d) => /Chairman/i.test(d.role));
  return (
    <>
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 overflow-hidden">
        <Image src={c.hero} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal><Link href="/concerns" className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-stone/70 hover:text-gold mb-8"><ArrowLeft size={14} /> All concerns</Link></Reveal>
          <Reveal delay={0.1}><p className="eyebrow mb-6">{c.sector}</p></Reveal>
          <h1 className="font-display text-5xl md:text-8xl font-light leading-[0.95] tracking-tight"><SplitWords text={c.title} /></h1>
          <Reveal delay={0.3} className="mt-8 max-w-2xl text-stone/75 text-lg">{c.tagline}</Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-start">
        <Reveal className="rounded-sm border hairline bg-ink-2 p-10 flex flex-col items-start gap-6 lg:sticky lg:top-32">
          {c.image ? <div className="relative h-24 w-full rounded-sm bg-stone"><Image src={c.image} alt={c.title} fill sizes="400px" className="object-contain p-4" /></div> : <p className="font-display text-6xl text-gold/70">0{idx + 1}</p>}
          <dl className="w-full divide-y hairline text-sm">
            <div className="flex justify-between py-3"><dt className="text-mist">Sector</dt><dd>{c.sector}</dd></div>
            <div className="flex justify-between py-3"><dt className="text-mist">Part of</dt><dd>Fortress Group</dd></div>
            {chairman && <div className="flex justify-between py-3"><dt className="text-mist">Chairman</dt><dd><Link href={`/team/${chairman.slug}`} className="hover:text-gold">{chairman.name}</Link></dd></div>}
            <div className="flex justify-between py-3"><dt className="text-mist">Status</dt><dd className={c.status === "active" ? "text-gold-2" : "text-stone/70"}>{c.status === "active" ? "Active" : "Profile in preparation"}</dd></div>
          </dl>
        </Reveal>
        <div>
          <Reveal><p className="eyebrow mb-5">Overview</p></Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-stone/80">{c.summary.map((t, i) => <p key={i}>{t}</p>)}</Reveal>
          {c.status === "coming-soon" && <div className="mt-12"><ComingSoon what={`The ${c.title} profile`}>Fortress Group has not yet published the detailed profile of {c.title}. This page will carry it as soon as it is released. In the meantime our head office can answer any query about this concern.</ComingSoon></div>}
        </div>
      </section>

      {c.slug === "fortress-real-estate" && <ShowcaseGrid eyebrow="Developed by Fortress Real Estate" title={<>Projects now <em className="text-gold">on sale</em></>} items={featuredProjects} href="/projects?status=sale-ongoing" />}

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-24">
        <Reveal><Link href={`/concerns/${next.slug}`} className="group flex items-center justify-between border-y hairline py-8">
          <div><p className="eyebrow mb-2">Next concern</p><p className="font-display text-3xl md:text-5xl font-light group-hover:text-gold transition-colors">{next.title}</p></div>
          <span className="grid h-12 w-12 place-items-center rounded-full border hairline group-hover:bg-gold group-hover:text-ink transition-all"><ArrowLeft size={16} className="rotate-180" /></span>
        </Link></Reveal>
      </section>
      <CTA image="/images/Tilottama.jpg" />
    </>
  );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense><Content params={params} /></Suspense>;
}
