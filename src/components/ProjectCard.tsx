"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { STATUS_LABEL, type Project } from "@/lib/data";

export default function ProjectCard({ p, index = 0, aspect = "aspect-[4/5]" }: { p: Project; index?: number; aspect?: string }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.8, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }} className="group">
      <Link href={`/projects/${p.slug}`} className="block">
        <div className={`relative ${aspect} overflow-hidden rounded-sm bg-ink-3`}>
          {p.image && (
            <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase backdrop-blur ${p.status === "sale-ongoing" ? "bg-gold text-ink" : p.status === "completed" ? "bg-white/15 text-stone" : "bg-ink/50 text-stone border hairline"}`}>
            {STATUS_LABEL[p.status]}
          </span>
          <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/30 text-stone opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight size={16} />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="eyebrow mb-2 opacity-80">{p.area ?? "Dhaka"}</p>
            <h3 className="font-display text-2xl md:text-3xl leading-tight">{p.name}</h3>
            {p.size && <p className="mt-1 text-xs text-stone/70 tracking-wider">{p.size.toLocaleString()} sft apartments</p>}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
