import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import { Reveal, ImageReveal, SplitWords } from "@/components/Reveal";
import { ABOUT_LINKS, company, concernPages, projects, stats } from "@/lib/data";

export const metadata: Metadata = { title: "Our Story" };

const chapters = [
  { n: "01", t: "A founder's conviction", img: "/images/Md-Gious-Uddin-Chairman.jpg", body: ["Fortress began with Md. Gious Uddin, an entrepreneur, business mentor and market specialist who founded Fortress Holdings Ltd. and Fortress Real Estate Ltd. with one mission: to create high-quality, exclusive apartment complexes in the prime locations of Dhaka and other major cities of Bangladesh.", "His promise to every customer was deliberately simple: transparency, integrity and excellence in all endeavours."] },
  { n: "02", t: "Integrity as the principal asset", img: "/images/Signature.jpg", body: ["In a sector where trust is hard-won, the group made honesty and quality its foundation. Skilled architects, engineers and craftsmen were brought together to build homes economically but never cheaply, exactly as the customer demanded.", "That approach earned Fortress Holdings and Fortress Real Estate their reputation as symbols of integrity, trust and reliability in the housing sector."] },
  { n: "03", t: "From Bashundhara to the lake", img: "/images/Jolshiri.jpg", body: [`Today the portfolio counts ${projects.length} residential projects across Bashundhara R/A, Jolshiri Abashon, Purbachal, Shawdesh Sornali, Mirpur and Uttara, with more than 500 families already living in a Fortress home.`, "Each new address carries the same signature: structural quality, natural light and premium finishing, backed by ISO-certified management systems."] },
  { n: "04", t: "A group, not just a developer", img: "/images/Fortress-Green-Touch-Sodesh-Sornali.jpg", body: [`Fortress has grown into a family of ${concernPages.length} concerns spanning real estate, home solutions, agro and farms, trading and a foundation, united by one culture of building with care.`, "The next chapter is being written in Purbachal and Jolshiri, where lakeside towers like Fortress Green Touch raise the bar for what a Dhaka apartment can be."] },
];

export default function StoryPage() {
  return (
    <>
      <PageHeader eyebrow="Our story" title="Built with" accent="care." image="/images/Light-House.jpg">{company.about}</PageHeader>
      <SubNav links={ABOUT_LINKS} />
      <Stats />
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 space-y-28">
        {chapters.map((c, i) => (
          <div key={c.n} className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <ImageReveal className={`relative rounded-sm ${i === 0 ? "aspect-square max-w-lg" : "aspect-[4/3]"}`}>
              <Image src={c.img} alt={c.t} fill sizes="50vw" className="object-cover object-top" />
            </ImageReveal>
            <div>
              <Reveal><p className="font-display text-6xl text-gold/60 mb-4">{c.n}</p></Reveal>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-[1.05]"><SplitWords text={c.t} /></h2>
              <Reveal delay={0.2} className="mt-7 space-y-5 text-stone/75 leading-relaxed max-w-xl">{c.body.map((b, k) => <p key={k}>{b}</p>)}</Reveal>
            </div>
          </div>
        ))}
      </section>
      <section className="bg-sand text-ink py-20">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 grid md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-t border-ink/15 pt-5">
              <p className="font-display text-5xl">{s.value}{s.suffix}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-ink/60 mt-2">{s.label}</p>
            </Reveal>
          ))}
          <Reveal className="md:col-span-4 mt-6"><Link href="/about/chairman" className="link-underline text-xs tracking-[0.3em] uppercase text-gold">Read the chairman&apos;s message</Link></Reveal>
        </div>
      </section>
      <CTA image="/images/Tilottama.jpg" />
    </>
  );
}
