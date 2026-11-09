"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { STATUS_LABEL, type Project } from "@/lib/data";
import ShortlistButton from "./ShortlistButton";

export default function ProjectCard({ p, index = 0, aspect = "aspect-[4/5]" }: { p: Project; index?: number; aspect?: string }) {
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(circle at ${useSpring(mx, { stiffness: 200, damping: 25 })} ${useSpring(my, { stiffness: 200, damping: 25 })}, rgba(255,255,255,0.18), transparent 55%)`;
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    mx.set(x); my.set(y); rx.set((0.5 - y) * 10); ry.set((x - 0.5) * 12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); mx.set(0.5); my.set(0.5); };
  return (
    <motion.article layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.8, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }} className="group" style={{ perspective: 1200 }}>
      <Link href={`/projects/${p.slug}`} className="block">
        <motion.div onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className={`relative ${aspect} overflow-hidden rounded-sm bg-ink-3 will-change-transform`}>
          <motion.div className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay" style={{ background: glare }} />
          {p.image && (
            <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase backdrop-blur ${p.status === "sale-ongoing" ? "bg-gold text-ink" : p.status === "completed" ? "bg-white/15 text-stone" : "bg-ink/50 text-stone border hairline"}`}>
            {STATUS_LABEL[p.status]}
          </span>
          <ShortlistButton slug={p.slug} className="absolute right-4 top-4 z-20 h-10 w-10" />
          <span className="absolute right-4 bottom-5 grid h-10 w-10 place-items-center rounded-full border border-white/30 text-stone opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight size={16} />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5 pr-16">
            <p className="eyebrow mb-2 opacity-80">{p.area ?? "Dhaka"}</p>
            <h3 className="font-display text-2xl md:text-3xl leading-tight">{p.name}</h3>
            {p.size && <p className="mt-1 text-xs text-stone/70 tracking-wider">{p.size.toLocaleString()} sft apartments</p>}
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
