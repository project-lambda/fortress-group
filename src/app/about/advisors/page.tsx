import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import CTA from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { ABOUT_LINKS, directors } from "@/lib/data";

export const metadata: Metadata = { title: "Board of Advisors" };

export default function AdvisorsPage() {
  return (
    <>
      <PageHeader eyebrow="Board of advisors" title="Guided by" accent="experience." image="/images/Galaxy.jpg">
        The advisory board brings together the group&apos;s founders, engineers and professionals who steer strategy, quality and governance across every concern.
      </PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-20">
        <ul className="divide-y hairline border-y hairline">
          {directors.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.05}>
              <Link href={`/team/${d.slug}`} className="group grid grid-cols-[88px_1fr] md:grid-cols-[120px_1fr_auto] items-center gap-6 md:gap-10 py-6 hover:bg-fg/[0.03] transition-colors px-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-3">{d.image && <Image src={d.image} alt={d.name} fill sizes="120px" className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" />}</div>
                <div>
                  <h3 className="font-display text-2xl md:text-4xl font-light leading-tight group-hover:text-gold transition-colors">{d.name}</h3>
                  <p className="mt-1 text-[10px] md:text-xs tracking-[0.2em] uppercase text-mist">{d.role}</p>
                  <p className="mt-3 hidden md:block text-sm text-stone/70 max-w-2xl line-clamp-2">{d.bio[0]}</p>
                </div>
                <span className="hidden md:inline text-xs tracking-[0.3em] uppercase text-gold link-underline">Profile</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
      <CTA image="/images/Freesia.jpg" />
    </>
  );
}
