"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowUpRight, BedDouble, Building2, Car, MapPin, Ruler } from "lucide-react";
import { Reveal, ImageReveal } from "./Reveal";
import ProjectCard from "./ProjectCard";
import { STATUS_LABEL, company, type Project } from "@/lib/data";

function parseSpecs(lines: string[]) {
  const specs: { k: string; v: string }[] = [];
  const amenities: string[] = [];
  const paragraphs: string[] = [];
  for (const raw of lines) {
    const l = raw.replace(/^[✅📍>\-•\s]+/, "").trim();
    if (!l) continue;
    const m = l.match(/^(.+?)[:：]\s*(.+)$/);
    if (m && l.length < 60) { specs.push({ k: m[1].trim(), v: m[2].trim() }); continue; }
    if (l.length < 28 && !/[।.]$/.test(l)) { amenities.push(l); continue; }
    paragraphs.push(l);
  }
  return { specs, amenities, paragraphs };
}

export default function ProjectDetail({ p, related }: { p: Project; related: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const { specs, amenities, paragraphs } = parseSpecs(p.description);
  const bn = paragraphs.some((t) => /[ঀ-৿]/.test(t));
  const facts = [
    { icon: MapPin, k: "Location", v: p.area ?? "Dhaka" },
    { icon: Ruler, k: "Apartment size", v: p.size ? `${p.size.toLocaleString()} sft` : "On request" },
    { icon: Building2, k: "Status", v: STATUS_LABEL[p.status] },
    { icon: BedDouble, k: "Type", v: "Residential apartments" },
    { icon: Car, k: "Parking", v: "Dedicated" },
  ];
  return (
    <>
      <section ref={ref} className="relative h-[92svh] min-h-[600px] overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          {p.image && <Image src={p.image} alt={p.name} fill priority sizes="100vw" className="object-cover" />}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/20" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 md:px-10 pb-14">
          <Reveal><Link href="/projects" className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-stone/70 hover:text-gold mb-8"><ArrowLeft size={14} /> All projects</Link></Reveal>
          <Reveal delay={0.1}><p className="eyebrow mb-4">{STATUS_LABEL[p.status]} · {p.area}</p></Reveal>
          <Reveal delay={0.2}><h1 className="font-display text-6xl md:text-[7vw] font-light leading-[0.95]">{p.name}</h1></Reveal>
          {p.size && <Reveal delay={0.3}><p className="mt-4 font-display text-2xl text-stone/70">{p.size.toLocaleString()} sft apartments</p></Reveal>}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 -mt-6 relative z-10">
        <Reveal className="grid grid-cols-2 md:grid-cols-5 divide-x hairline rounded-sm border hairline bg-ink-2/90 backdrop-blur">
          {facts.map((f) => (
            <div key={f.k} className="p-5 md:p-6">
              <f.icon size={16} className="text-gold mb-3" />
              <p className="text-[10px] tracking-[0.25em] uppercase text-mist">{f.k}</p>
              <p className="mt-1 text-sm">{f.v}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-16">
        <div>
          <Reveal><p className="eyebrow mb-5">Overview</p></Reveal>
          {paragraphs.length > 0 ? (
            <Reveal delay={0.1} className={`space-y-5 leading-relaxed text-stone/80 ${bn ? "text-lg" : "text-base"}`}>
              {paragraphs.map((t, i) => <p key={i}>{t}</p>)}
            </Reveal>
          ) : (
            <Reveal delay={0.1} className="space-y-5 leading-relaxed text-stone/80">
              <p>{p.name} is a Fortress Group residential development in {p.area ?? "Dhaka"}, designed with the group&apos;s signature attention to structural quality, natural light and premium finishing.</p>
              <p>Contact our sales team for the latest floor plans, pricing and availability.</p>
            </Reveal>
          )}
          {specs.length > 0 && (
            <Reveal delay={0.2} className="mt-12">
              <p className="eyebrow mb-5">Specifications</p>
              <dl className="grid sm:grid-cols-2 gap-x-10">
                {specs.map((s) => (
                  <div key={s.k} className="flex justify-between gap-4 border-b hairline py-3 text-sm"><dt className="text-mist">{s.k}</dt><dd className="text-right">{s.v}</dd></div>
                ))}
              </dl>
            </Reveal>
          )}
          {amenities.length > 0 && (
            <Reveal delay={0.25} className="mt-12">
              <p className="eyebrow mb-5">Features & amenities</p>
              <ul className="flex flex-wrap gap-2">
                {amenities.map((a, i) => <li key={i} className="rounded-full border hairline px-4 py-2 text-sm text-stone/80 hover:border-gold/50 transition-colors">{a}</li>)}
              </ul>
            </Reveal>
          )}
          {p.gallery.length > 0 && (
            <div className="mt-14 grid gap-6">
              {p.gallery.map((g, i) => (
                <ImageReveal key={g} delay={i * 0.05} className="relative aspect-square rounded-sm">
                  <Image src={g} alt={`${p.name} ${i + 1}`} fill sizes="60vw" className="object-cover" />
                </ImageReveal>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 h-fit space-y-6">
          <Reveal className="rounded-sm border hairline bg-ink-2 p-7">
            <p className="eyebrow mb-3">Interested?</p>
            <h3 className="font-display text-3xl font-light mb-6">Book a visit to {p.name.replace(/^Fortress /, "")}</h3>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Thank you — our team will call you shortly."); }}>
              <input required placeholder="Your name" className="w-full rounded-sm border hairline bg-ink px-4 py-3 text-sm outline-none focus:border-gold/60" />
              <input required placeholder="Phone number" type="tel" className="w-full rounded-sm border hairline bg-ink px-4 py-3 text-sm outline-none focus:border-gold/60" />
              <textarea placeholder="Message (optional)" rows={3} className="w-full rounded-sm border hairline bg-ink px-4 py-3 text-sm outline-none focus:border-gold/60" />
              <button className="w-full rounded-sm bg-gold py-3.5 text-xs tracking-[0.25em] uppercase text-ink hover:bg-gold-2 transition-colors">Request callback</button>
            </form>
            <div className="mt-6 flex flex-col gap-2 text-sm text-stone/70">
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-gold">{company.phone}</a>
              <a href={`tel:${company.phone2.replace(/\s/g, "")}`} className="hover:text-gold">{company.phone2}</a>
              <a href={company.socials.whatsapp} target="_blank" rel="noreferrer" className="hover:text-gold inline-flex items-center gap-1">WhatsApp us <ArrowUpRight size={12} /></a>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="rounded-sm overflow-hidden border hairline">
            <iframe title="map" loading="lazy" className="h-64 w-full grayscale invert-[0.9] contrast-[0.9]" src={`https://www.google.com/maps?q=${encodeURIComponent(`${p.name} ${p.area ?? ""} Dhaka`)}&output=embed`} />
          </Reveal>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-28">
          <Reveal><p className="eyebrow mb-4">You may also like</p><h2 className="font-display text-4xl md:text-5xl font-light mb-10">More in <em className="text-gold">{p.area ?? "Dhaka"}</em></h2></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{related.map((r, i) => <ProjectCard key={r.slug} p={r} index={i} />)}</div>
        </section>
      )}
    </>
  );
}
