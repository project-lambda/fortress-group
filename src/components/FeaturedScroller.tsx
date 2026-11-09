"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";
import { Reveal } from "./Reveal";

export default function FeaturedScroller({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  return (
    <section ref={ref} className="relative h-[320vh] hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="mx-auto w-full max-w-[1600px] px-10 mb-10 flex items-end justify-between">
          <Reveal>
            <p className="eyebrow mb-4">Sale ongoing</p>
            <h2 className="font-display text-6xl font-light leading-none">Choose your <em className="text-gold">dream</em> project</h2>
          </Reveal>
          <Link href="/projects?status=sale-ongoing" className="link-underline text-xs tracking-[0.3em] uppercase text-stone/80">View all</Link>
        </div>
        <motion.div style={{ x }} className="flex gap-8 pl-10 w-max">
          {items.map((p, i) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="group relative block h-[62vh] w-[46vh] shrink-0 overflow-hidden rounded-sm">
              <Image src={p.image!} alt={p.name} fill sizes="40vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <span className="absolute left-5 top-5 font-display text-5xl text-stone/40">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                <p className="eyebrow mb-2">{p.area}</p>
                <h3 className="font-display text-3xl">{p.name}</h3>
                <div className="mt-3 flex items-center justify-between text-xs tracking-widest text-stone/70 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span>{p.size ? `${p.size.toLocaleString()} SFT` : "Apartments"}</span>
                  <span className="inline-flex items-center gap-1 text-gold">Explore <ArrowUpRight size={12} /></span>
                </div>
              </div>
            </Link>
          ))}
          <div className="flex h-[62vh] w-[46vh] shrink-0 items-center justify-center rounded-sm border hairline">
            <Link href="/projects" className="group text-center">
              <span className="block font-display text-4xl font-light mb-4 group-hover:text-gold transition-colors">All 35 projects</span>
              <span className="inline-grid h-16 w-16 place-items-center rounded-full border border-gold/60 text-gold group-hover:bg-gold group-hover:text-ink transition-all"><ArrowUpRight /></span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
