"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Volume2, VolumeX, Maximize2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { company } from "@/lib/data";

export default function Film() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px 0px" });
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [24, 4]);

  const send = (func: string) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  const toggleSound = () => { send(muted ? "unMute" : "mute"); setMuted((m) => !m); };
  const fullscreen = () => frame.current?.requestFullscreen?.();

  const src = `https://www.youtube-nocookie.com/embed/${company.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${company.videoId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3`;

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
        <motion.div style={{ scale, borderRadius: radius }} className="theme-dark relative aspect-video w-full overflow-hidden bg-ink-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
          {inView && (
            <iframe
              ref={frame}
              onLoad={() => setTimeout(() => setReady(true), 900)}
              className="absolute inset-0 h-full w-full"
              src={src}
              title="Fortress Group Project Overview Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          )}
          {/* poster fades out once the player is running */}
          <motion.div animate={{ opacity: ready ? 0 : 1 }} transition={{ duration: 1 }} className={`absolute inset-0 ${ready ? "pointer-events-none" : ""}`}>
            <Image src="/images/film-poster.jpg" alt="Fortress Group project overview" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-ink/30" />
          </motion.div>
          {/* edge vignette, lets clicks through to the player */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Project overview</p>
              <p className="font-display text-2xl md:text-4xl font-light">The Fortress Group film</p>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <button onClick={toggleSound} aria-pressed={!muted} className="inline-flex items-center gap-2 rounded-full border border-fg/30 bg-ink/50 backdrop-blur px-4 h-11 text-[11px] tracking-[0.25em] uppercase text-stone hover:border-gold/70 hover:text-gold-2 transition-colors">
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}<span className="hidden sm:inline">{muted ? "Sound on" : "Mute"}</span>
              </button>
              <button onClick={fullscreen} aria-label="Fullscreen" className="grid h-11 w-11 place-items-center rounded-full border border-fg/30 bg-ink/50 backdrop-blur text-stone hover:border-gold/70 hover:text-gold-2 transition-colors"><Maximize2 size={15} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
