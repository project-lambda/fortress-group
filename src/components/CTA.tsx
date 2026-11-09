import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { company } from "@/lib/data";

export default function CTA({ image = "/images/Elysium.jpg" }: { image?: string }) {
  return (
    <section className="theme-dark relative overflow-hidden py-32 md:py-44">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal><p className="eyebrow mb-6">Book a site visit</p></Reveal>
        <Reveal delay={0.1}><h2 className="font-display text-5xl md:text-7xl font-light leading-[1]">Your next address is <em className="text-gold">waiting.</em></h2></Reveal>
        <Reveal delay={0.2}><p className="mt-8 text-stone/75 max-w-xl mx-auto">Speak with our sales team today and confirm your booking at any of our ongoing projects.</p></Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-xs tracking-[0.25em] uppercase text-ink hover:bg-gold-2 transition-colors">Request a callback <ArrowUpRight size={14} /></Link>
          <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-fg/30 px-8 py-4 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors">{company.phone}</a>
        </Reveal>
      </div>
    </section>
  );
}
