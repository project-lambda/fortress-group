"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { LayoutGrid, Rows3, Search } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { STATUS_LABEL, type Area, type Project, type ProjectStatus } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import Select from "./Select";
import { useLenis } from "lenis/react";

const STATUSES: (ProjectStatus | "all")[] = ["all", "sale-ongoing", "ongoing", "completed", "upcoming"];

export default function ProjectsExplorer({ projects, areas }: { projects: Project[]; areas: Area[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const status = (sp.get("status") ?? "all") as ProjectStatus | "all";
  const area = sp.get("area") ?? "all";
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const topRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const scrollToTop = () => {
    const el = topRef.current; if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    if (window.scrollY <= y) return;
    if (lenis) lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: "smooth" });
  };
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp.toString());
    if (v === "all") n.delete(k); else n.set(k, v);
    router.replace(`/projects${n.toString() ? `?${n}` : ""}`, { scroll: false });
    scrollToTop();
  };

  const list = useMemo(() => projects.filter((p) =>
    (status === "all" || p.status === status) &&
    (area === "all" || areas.find((a) => a.slug === area)?.name === p.area) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()))
  ), [projects, areas, status, area, q]);

  return (
    <div ref={topRef} className="mx-auto max-w-[1600px] px-5 md:px-10 pb-32 min-h-[80vh]">
      <div className="sticky top-20 z-30 -mx-5 md:-mx-10 px-5 md:px-10 py-4 bg-ink/80 backdrop-blur-xl border-y hairline mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <LayoutGroup id="status">
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => set("status", s)} className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${status === s ? "text-ink" : "text-stone/70 hover:text-stone"}`}>
                  {status === s && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                  <span className="relative">{s === "all" ? "All" : STATUS_LABEL[s]}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <Select value={area} onChange={(e) => set("area", e.target.value)} wrapClassName="rounded-full border hairline bg-ink-2 focus-within:border-gold/60" className="px-4 py-2 text-xs tracking-wider">
            <option value="all">All locations</option>
            {areas.map((a) => <option key={a.slug} value={a.slug}>{a.name} ({a.count})</option>)}
          </Select>
          <label className="flex items-center gap-2 rounded-full border hairline bg-ink-2 px-4 py-2 text-xs lg:ml-auto">
            <Search size={14} className="text-mist" />
            <input value={q} onChange={(e) => { setQ(e.target.value); scrollToTop(); }} placeholder="Search projects" className="bg-transparent outline-none placeholder:text-mist w-40" />
          </label>
          <div className="hidden md:flex rounded-full border hairline overflow-hidden">
            <button aria-label="Grid" onClick={() => { setView("grid"); scrollToTop(); }} className={`p-2.5 ${view === "grid" ? "bg-stone text-ink" : "text-mist"}`}><LayoutGrid size={14} /></button>
            <button aria-label="List" onClick={() => { setView("list"); scrollToTop(); }} className={`p-2.5 ${view === "list" ? "bg-stone text-ink" : "text-mist"}`}><Rows3 size={14} /></button>
          </div>
        </div>
      </div>

      <p className="mb-8 text-xs tracking-[0.3em] uppercase text-mist">{list.length} {list.length === 1 ? "project" : "projects"}</p>

      {view === "grid" ? (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}
          </AnimatePresence>
        </motion.div>
      ) : (
        <ul className="divide-y hairline border-y hairline">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.li key={p.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Link href={`/projects/${p.slug}`} className="group grid grid-cols-[72px_1fr_auto] md:grid-cols-[96px_2fr_1fr_1fr_auto] items-center gap-6 py-5 hover:bg-white/[0.03] transition-colors px-2">
                  <div className="relative h-20 w-full overflow-hidden rounded-sm">{p.image && <Image src={p.image} alt="" fill sizes="96px" className="object-cover group-hover:scale-110 transition-transform duration-700" />}</div>
                  <span className="font-display text-2xl group-hover:text-gold transition-colors">{p.name}</span>
                  <span className="hidden md:block text-sm text-stone/70">{p.area}</span>
                  <span className="hidden md:block text-sm text-stone/70">{p.size ? `${p.size.toLocaleString()} sft` : "—"}</span>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-gold">{STATUS_LABEL[p.status]}</span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {list.length === 0 && <p className="py-24 text-center text-mist font-display text-3xl">No projects match that filter.</p>}
    </div>
  );
}
