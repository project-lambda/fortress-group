"use client";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Heart, Trash2, X } from "lucide-react";
import { useShortlist } from "@/lib/shortlist";
import { STATUS_LABEL, type Project } from "@/lib/data";
import { parseProject } from "@/lib/specs";
import LeadForm from "./LeadForm";
import { Reveal } from "./Reveal";

export default function ShortlistView({ projects }: { projects: Project[] }) {
  const { slugs, remove, clear } = useShortlist();
  const list = slugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) as Project[];

  if (list.length === 0) {
    return (
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-32">
        <div className="rounded-sm border hairline bg-ink-2 px-6 py-24 text-center">
          <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-gold/40 text-gold"><Heart size={22} /></span>
          <p className="font-display text-4xl font-light mb-3">Nothing saved yet</p>
          <p className="text-stone/70 text-sm max-w-md mx-auto">Browse the portfolio and tap the heart on the projects you like. They will wait for you here, even after you close the browser.</p>
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs tracking-[0.25em] uppercase text-ink hover:bg-gold-2 transition-colors">Browse projects <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    );
  }

  const rows = list.map((p) => {
    const parsed = parseProject(p);
    const f = (k: string) => parsed.facts.find((x) => x.key === k)?.value ?? "—";
    return { p, parsed, size: p.size ? `${p.size.toLocaleString()} sft` : f("area"), beds: f("bedrooms"), baths: f("bathrooms"), units: f("units"), building: parsed.structure?.code ?? "—", land: f("land"), facing: f("facing") };
  });
  const specs: { label: string; get: (r: (typeof rows)[number]) => string }[] = [
    { label: "Location", get: (r) => r.p.area ?? "Dhaka" },
    { label: "Status", get: (r) => STATUS_LABEL[r.p.status] },
    { label: "Apartment size", get: (r) => r.size },
    { label: "Bedrooms", get: (r) => r.beds },
    { label: "Bathrooms", get: (r) => r.baths },
    { label: "Units per floor", get: (r) => r.units },
    { label: "Building", get: (r) => r.building },
    { label: "Land", get: (r) => r.land },
    { label: "Facing", get: (r) => r.facing },
  ];
  const message = `I'd like details and pricing for my shortlist: ${list.map((p) => p.title).join("; ")}.`;

  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-32">
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-mist">{list.length} {list.length === 1 ? "project" : "projects"} saved</p>
        <button onClick={clear} className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone/60 hover:text-red-400 transition-colors"><Trash2 size={13} /> Clear all</button>
      </div>

      <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0 pb-4">
        <table className="w-full min-w-[720px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-ink w-40 md:w-52 text-left align-bottom pb-5 pr-4 text-[10px] tracking-[0.3em] uppercase text-mist font-normal">Compare</th>
              <AnimatePresence initial={false}>
                {rows.map(({ p }) => (
                  <motion.th key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-left align-bottom pb-5 px-3 font-normal min-w-[200px]">
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-3 mb-4">
                      {p.image && <Image src={p.image} alt={p.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                      <button onClick={() => remove(p.slug)} aria-label="Remove" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/70 text-stone hover:bg-red-500 hover:text-white transition-colors"><X size={14} /></button>
                    </div>
                    <Link href={`/projects/${p.slug}`} className="font-display text-2xl leading-tight hover:text-gold transition-colors">{p.name}</Link>
                  </motion.th>
                ))}
              </AnimatePresence>
            </tr>
          </thead>
          <tbody>
            {specs.map((s, i) => (
              <tr key={s.label} className={i % 2 ? "" : "bg-white/[0.025]"}>
                <th className="sticky left-0 z-10 bg-ink text-left py-4 pr-4 text-[10px] tracking-[0.25em] uppercase text-mist font-normal border-t hairline">{s.label}</th>
                {rows.map((r) => <td key={r.p.slug} className="py-4 px-3 text-sm text-stone/85 border-t hairline">{s.get(r)}</td>)}
              </tr>
            ))}
            <tr>
              <th className="sticky left-0 z-10 bg-ink border-t hairline" />
              {rows.map((r) => <td key={r.p.slug} className="py-5 px-3 border-t hairline"><Link href={`/projects/${r.p.slug}`} className="link-underline text-xs tracking-[0.25em] uppercase text-gold">View project</Link></td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <Reveal className="mt-20 grid lg:grid-cols-[1fr_1.1fr] gap-12 rounded-sm border hairline bg-ink-2 p-7 md:p-10">
        <div>
          <p className="eyebrow mb-4">One request, all projects</p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">Send your shortlist to our <em className="text-gold">sales team</em></h2>
          <p className="mt-5 text-stone/70 text-sm leading-relaxed">We will come back with floor plans, availability and pricing for every project you saved, so you can compare them in one conversation.</p>
          <ul className="mt-6 space-y-2 text-sm text-stone/80">{list.map((p) => <li key={p.slug} className="flex items-center gap-2"><Heart size={11} className="fill-gold text-gold" /> {p.title}</li>)}</ul>
        </div>
        <LeadForm key={slugs.join("|")} source="shortlist" project={list.map((p) => p.name).join(", ").slice(0, 160)} initialMessage={message} submitLabel="Send my shortlist" />
      </Reveal>
    </section>
  );
}
