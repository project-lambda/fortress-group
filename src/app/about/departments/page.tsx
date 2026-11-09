import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, HardHat, Headset, Megaphone, Scale, Wallet } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import ComingSoon from "@/components/ComingSoon";
import CTA from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { ABOUT_LINKS, directors, experts } from "@/lib/data";

export const metadata: Metadata = { title: "Departments" };

const depts = [
  { icon: Megaphone, t: "Sales & Marketing", d: "Guides every family from first visit to handover.", people: experts.length },
  { icon: HardHat, t: "Engineering & Operations", d: "Structural design, site execution and quality control under the Director (Operation & Chief Engineer).", people: 1 },
  { icon: Building2, t: "Land & Development", d: "Land sourcing, approvals and master planning for new addresses." },
  { icon: Headset, t: "Customer Care", d: "After-sales service, documentation and home-care support." },
  { icon: Wallet, t: "Finance & Accounts", d: "Payment plans, banking partners and financial reporting." },
  { icon: Scale, t: "Legal & Compliance", d: "Title verification, registration and regulatory compliance." },
];

export default function DepartmentsPage() {
  const ops = directors.find((d) => /Chief Engineer/i.test(d.role));
  return (
    <>
      <PageHeader eyebrow="Departments" title="How Fortress" accent="is organised." image="/images/Signature.jpg">
        Six departments work side by side so that a Fortress home is designed, built, sold and cared for by the same standard.
      </PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depts.map((d, i) => (
            <Reveal key={d.t} delay={(i % 3) * 0.08} className="rounded-sm border hairline bg-ink-2 p-8">
              <d.icon size={20} className="text-gold mb-6" />
              <h3 className="font-display text-2xl md:text-3xl font-light">{d.t}</h3>
              <p className="mt-3 text-sm text-stone/70 leading-relaxed">{d.d}</p>
              {d.people && <p className="mt-5 text-[10px] tracking-[0.25em] uppercase text-mist">{d.people} {d.people === 1 ? "profile" : "profiles"} online</p>}
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-sand text-ink py-20">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"><div><p className="eyebrow mb-3">Sales & marketing</p><h2 className="font-display text-4xl md:text-5xl font-light">Meet the <em className="text-gold">team</em></h2></div><Link href="/team" className="link-underline text-xs tracking-[0.3em] uppercase text-ink/70">All people</Link></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
            {ops && (
              <Reveal>
                <Link href={`/team/${ops.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-stone">{ops.image && <Image src={ops.image} alt={ops.name} fill sizes="20vw" className="object-cover object-top" />}</div>
                  <p className="mt-4 font-display text-lg leading-tight">{ops.name}</p>
                  <p className="text-[11px] tracking-wider uppercase text-ink/60 mt-1">Engineering & Operations</p>
                </Link>
              </Reveal>
            )}
            {experts.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.05}>
                <Link href={`/team/${e.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-stone grayscale group-hover:grayscale-0 transition-all duration-700">{e.image && <Image src={e.image} alt={e.name} fill sizes="20vw" className="object-cover object-top" />}</div>
                  <p className="mt-4 font-display text-lg leading-tight">{e.name}</p>
                  <p className="text-[11px] tracking-wider uppercase text-ink/60 mt-1">{e.role}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-20"><ComingSoon what="The full departments directory" /></section>
      <CTA image="/images/Tilottama.jpg" />
    </>
  );
}
