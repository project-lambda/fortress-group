import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal, ImageReveal } from "@/components/Reveal";
import { directors, experts, getPerson } from "@/lib/data";

export function generateStaticParams() { return [...directors, ...experts].map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return { title: getPerson((await params).slug)?.name ?? "Team" };
}
async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPerson((await params).slug);
  if (!p) notFound();
  return (
    <section className="mx-auto max-w-[1400px] px-5 md:px-10 pt-36 pb-28 grid lg:grid-cols-[0.8fr_1.2fr] gap-16">
      <div className="lg:sticky lg:top-32 h-fit">
        <Reveal><Link href="/team" className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-stone/70 hover:text-gold mb-8"><ArrowLeft size={14} /> Leadership</Link></Reveal>
        <ImageReveal className="relative aspect-[3/4] rounded-sm">{p.image && <Image src={p.image} alt={p.name} fill priority sizes="40vw" className="object-cover object-top" />}</ImageReveal>
      </div>
      <div>
        <Reveal><p className="eyebrow mb-5">{p.role}</p></Reveal>
        <Reveal delay={0.1}><h1 className="font-display text-5xl md:text-7xl font-light leading-[0.95]">{p.name}</h1></Reveal>
        <Reveal delay={0.2} className="mt-10 space-y-5 text-lg leading-relaxed text-stone/80">
          {p.bio.length ? p.bio.map((t, i) => <p key={i}>{t}</p>) : <p>{p.name} is part of the Fortress Group sales & marketing team, helping families across Dhaka find their next home.</p>}
        </Reveal>
      </div>
    </section>
  );
}

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <Suspense><Content {...props} /></Suspense>;
}
