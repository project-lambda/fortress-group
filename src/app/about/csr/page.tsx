import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import ComingSoon from "@/components/ComingSoon";
import CTA from "@/components/CTA";
import { Reveal, ImageReveal } from "@/components/Reveal";
import { ABOUT_LINKS, concernPages, values } from "@/lib/data";

export const metadata: Metadata = { title: "CSR" };

export default function CsrPage() {
  const foundation = concernPages.find((c) => c.slug === "fortress-foundation")!;
  const v = values.filter((x) => /Sustainability|Community/.test(x.t));
  return (
    <>
      <PageHeader eyebrow="Corporate social responsibility" title="Building" accent="beyond buildings." image="/images/csr-1.jpg">
        Fortress believes real estate should serve the present while paving the way for future generations.
      </PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <ImageReveal className="relative aspect-[4/3] rounded-sm"><Image src="/images/csr-1.jpg" alt="Fortress CSR" fill sizes="50vw" className="object-cover" /></ImageReveal>
        <div>
          <Reveal><p className="eyebrow mb-5">Our commitments</p></Reveal>
          <div className="space-y-8">
            {v.map((x, i) => (
              <Reveal key={x.t} delay={i * 0.1} className="border-t hairline pt-6">
                <h3 className="font-display text-3xl font-light">{x.t}</h3>
                <p className="mt-2 text-stone/70 leading-relaxed">{x.d}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2} className="border-t hairline pt-6">
              <h3 className="font-display text-3xl font-light">{foundation.title}</h3>
              <p className="mt-2 text-stone/70 leading-relaxed">{foundation.summary[0]}</p>
              <Link href={`/concerns/${foundation.slug}`} className="link-underline mt-4 inline-block text-xs tracking-[0.3em] uppercase text-gold">About the foundation</Link>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-24"><ComingSoon what="The CSR report" /></section>
      <CTA image="/images/Tilottama.jpg" />
    </>
  );
}
