import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import CTA from "@/components/CTA";
import { news, company } from "@/lib/data";

export const metadata: Metadata = { title: "News & Events" };

export default function NewsPage() {
  return (
    <>
      <PageHeader eyebrow="News & events" title="Life at" accent="Fortress." image="/images/Rosemery.jpg">
        Celebrations, handovers and milestones from across the group.
      </PageHeader>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((n, i) => (
          <Reveal key={n.slug} delay={i * 0.1} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-3">
              {n.image && <Image src={n.image} alt={n.title} fill sizes="33vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />}
            </div>
            <p className="mt-5 eyebrow">{new Date(n.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
            <h3 className="mt-2 font-display text-3xl font-light">{n.title}</h3>
            <p className="mt-2 text-sm text-mist">Full story coming soon.</p>
          </Reveal>
        ))}
      </section>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-28">
        <Reveal><p className="eyebrow mb-4">Watch</p><h2 className="font-display text-4xl md:text-5xl font-light mb-8">Fortress on <em className="text-gold">video</em></h2></Reveal>
        <Reveal delay={0.1} className="relative aspect-video overflow-hidden rounded-sm border hairline">
          <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube.com/embed/${company.videoId}`} title="Fortress Group" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </Reveal>
      </section>
      <CTA image="/images/Lavender.jpg" />
    </>
  );
}
