import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import ComingSoon from "@/components/ComingSoon";
import CTA from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { ABOUT_LINKS, awards } from "@/lib/data";

export const metadata: Metadata = { title: "Awards & Recognition" };

export default function AwardsPage() {
  return (
    <>
      <PageHeader eyebrow="Awards & recognition" title="Recognised for" accent="care." image="/images/Marjan.jpg">
        Certifications and honours that reflect two decades of building with integrity.
      </PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08} className="group rounded-sm border hairline bg-ink-2 p-8 flex flex-col items-center text-center">
              <div className="relative h-40 w-full mb-8">{a.image && <Image src={a.image} alt={a.title} fill sizes="25vw" className="object-contain transition-transform duration-700 group-hover:scale-105" />}</div>
              <h3 className="font-display text-2xl font-light">{a.title}</h3>
              <p className="mt-3 text-sm text-stone/70 leading-relaxed">{a.description}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-16"><ComingSoon what="The complete awards archive" /></div>
      </section>
      <CTA image="/images/Freesia.jpg" />
    </>
  );
}
