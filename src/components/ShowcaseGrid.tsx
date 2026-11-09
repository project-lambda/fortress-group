import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { Reveal } from "./Reveal";
import type { Project } from "@/lib/data";

export default function ShowcaseGrid({ eyebrow, title, items, href, limit = 6 }: { eyebrow: string; title: React.ReactNode; items: Project[]; href: string; limit?: number }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="font-display text-5xl md:text-6xl font-light leading-none">{title}</h2>
        </Reveal>
        <Link href={href} className="link-underline text-xs tracking-[0.3em] uppercase text-stone/80">View all</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.filter((p) => p.image).slice(0, limit).map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}
      </div>
    </section>
  );
}
