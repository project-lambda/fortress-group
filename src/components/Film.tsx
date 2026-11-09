"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { company } from "@/lib/data";

export default function Film() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [24, 4]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">The film</p>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-none">Fortress, in <em className="text-gold">motion</em></h2>
          </div>
          <p className="text-sm text-mist max-w-sm">A short overview of the projects, the people and the care that goes into every Fortress address.</p>
        </Reveal>
        <motion.div style={{ scale, borderRadius: radius }} className="relative aspect-video w-full overflow-hidden bg-ink-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.iframe
                key="player"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${company.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Fortress Group Project Overview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <motion.button key="poster" exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.6 }} onClick={() => setPlaying(true)} aria-label="Play the Fortress Group film" className="group absolute inset-0 w-full text-left">
                <motion.div style={{ y }} className="absolute -inset-y-12 inset-x-0">
                  <Image src="/images/film-poster.jpg" alt="Fortress Group project overview" fill sizes="100vw" className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/10" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center">
                  <span className="absolute h-28 w-28 md:h-36 md:w-36 rounded-full border border-white/30 animate-ping [animation-duration:2.4s]" />
                  <span className="relative grid h-20 w-20 md:h-28 md:w-28 place-items-center rounded-full bg-stone text-ink transition-all duration-500 group-hover:bg-gold group-hover:scale-110">
                    <Play size={28} className="ml-1 fill-current" />
                  </span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex items-end justify-between gap-6">
                  <div>
                    <p className="eyebrow mb-2">Project overview</p>
                    <p className="font-display text-2xl md:text-4xl font-light">Watch the Fortress Group film</p>
                  </div>
                  <span className="hidden md:inline text-[11px] tracking-[0.3em] uppercase text-stone/70">YouTube · HD</span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
