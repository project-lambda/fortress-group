"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "./Reveal";
import type { Area } from "@/lib/data";

export default function AreasGrid({ areas }: { areas: Area[] }) {
  const [active, setActive] = useState(0);
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div key={areas[active].slug} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
          <Image src={areas[active].image} alt="" fill sizes="100vw" className="object-cover opacity-30" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10 grid lg:grid-cols-[1fr_1.3fr] gap-16">
        <Reveal>
          <p className="eyebrow mb-6">Discover projects</p>
          <h2 className="font-display text-5xl md:text-7xl font-light leading-none">Find your <em className="text-gold">favourite</em> area</h2>
          <p className="mt-6 text-stone/70 max-w-md">From the lakeside calm of Jolshiri to the heart of Bashundhara, our residences sit in Dhaka&apos;s most desirable neighbourhoods.</p>
        </Reveal>
        <ul>
          {areas.map((a, i) => (
            <li key={a.slug} onMouseEnter={() => setActive(i)}>
              <Link href={`/projects?area=${a.slug}`} className={`group flex items-center justify-between border-b hairline py-6 transition-colors ${active === i ? "text-gold" : "text-stone/80"}`}>
                <span className="flex items-baseline gap-5">
                  <span className="text-xs tracking-[0.3em] text-mist">0{i + 1}</span>
                  <span className="font-display text-3xl md:text-5xl font-light group-hover:translate-x-3 transition-transform duration-500">{a.name}</span>
                </span>
                <span className="text-xs tracking-[0.25em] uppercase text-mist">{a.count} {a.count === 1 ? "project" : "projects"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
