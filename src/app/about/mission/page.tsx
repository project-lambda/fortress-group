import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import CTA from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { ABOUT_LINKS, company, values } from "@/lib/data";

export const metadata: Metadata = { title: "Mission, Vision & Values" };

export default function MissionPage() {
  return (
    <>
      <PageHeader eyebrow="Mission, vision & values" title="What we" accent="stand for." image="/images/Purbachal.jpg">
        Our vision and mission come to life through seven core values that drive every decision at Fortress Group.
      </PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid lg:grid-cols-2 gap-12">
        <Reveal className="rounded-sm border hairline bg-ink-2 p-10 md:p-14">
          <p className="eyebrow mb-6">Our mission</p>
          <p className="font-display text-3xl md:text-4xl font-light leading-snug">{company.mission}</p>
        </Reveal>
        <Reveal delay={0.1} className="relative overflow-hidden rounded-sm border hairline p-10 md:p-14">
          <Image src="/images/Jolshiri.jpg" alt="" fill sizes="50vw" className="object-cover opacity-25" />
          <div className="relative">
            <p className="eyebrow mb-6">Our vision</p>
            <p className="font-display text-3xl md:text-4xl font-light leading-snug">{company.vision}</p>
          </div>
        </Reveal>
      </section>
      <section className="bg-sand text-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal className="mb-14 max-w-2xl"><p className="eyebrow mb-4">Seven core values</p><h2 className="font-display text-5xl md:text-6xl font-light leading-none">The code we <em className="text-gold">build by</em></h2></Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={(i % 4) * 0.08} className="border-t border-ink/15 pt-6">
                <p className="font-display text-4xl text-gold mb-3">0{i + 1}</p>
                <h3 className="font-display text-2xl md:text-3xl mb-3">{v.t}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTA image="/images/Freesia.jpg" />
    </>
  );
}
