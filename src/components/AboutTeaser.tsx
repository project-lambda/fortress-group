"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageReveal, Reveal, SplitWords } from "./Reveal";
import { company } from "@/lib/data";

export default function AboutTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  return (
    <section ref={ref} className="relative mx-auto max-w-[1600px] px-5 md:px-10 py-24 md:py-40 grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative h-[70vh] min-h-[520px]">
        <motion.div style={{ y: y1 }} className="absolute left-0 top-0 w-[68%] h-[75%]">
          <ImageReveal className="h-full w-full rounded-sm">
            <Image src="/images/Bashundhara.jpg" alt="Bashundhara" fill sizes="40vw" className="object-cover" />
          </ImageReveal>
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute right-0 bottom-0 w-[52%] h-[58%]">
          <ImageReveal className="h-full w-full rounded-sm" delay={0.2}>
            <Image src="/images/Jolshiri.jpg" alt="Jolshiri" fill sizes="30vw" className="object-cover" />
          </ImageReveal>
        </motion.div>
        <Reveal delay={0.4} className="absolute -bottom-4 left-6 rounded-sm bg-gold px-6 py-5 text-ink">
          <p className="font-display text-4xl leading-none">ISO</p>
          <p className="text-[10px] tracking-[0.25em] uppercase mt-1">Certified company</p>
        </Reveal>
      </div>
      <div>
        <Reveal><p className="eyebrow mb-6">About Fortress Group</p></Reveal>
        <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05]">
          <SplitWords text="A distinguished name in Bangladesh real estate, built on" /> <em className="text-gold"><SplitWords text="integrity." delay={0.4} /></em>
        </h2>
        <Reveal delay={0.3}><p className="mt-8 text-stone/75 leading-relaxed max-w-xl">{company.about}</p></Reveal>
        <Reveal delay={0.4} className="mt-10 grid sm:grid-cols-2 gap-8">
          <div className="border-t hairline pt-5">
            <p className="eyebrow mb-3">Mission</p>
            <p className="text-sm text-stone/70 leading-relaxed">{company.mission}</p>
          </div>
          <div className="border-t hairline pt-5">
            <p className="eyebrow mb-3">Vision</p>
            <p className="text-sm text-stone/70 leading-relaxed">{company.vision}</p>
          </div>
        </Reveal>
        <Reveal delay={0.5} className="mt-10">
          <Link href="/about" className="group inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-gold">
            Our story <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/60 group-hover:bg-gold group-hover:text-ink transition-all"><ArrowUpRight size={14} /></span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
