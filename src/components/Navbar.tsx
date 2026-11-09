"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone, ArrowUpRight } from "lucide-react";
import { company, featuredProjects } from "@/lib/data";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Leadership" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled && !open ? "bg-ink/80 backdrop-blur-xl border-b hairline" : open ? "" : "bg-gradient-to-b from-black/85 via-black/50 to-transparent backdrop-blur-[2px]"}`}>
        {!scrolled && !open && <div className="pointer-events-none absolute inset-x-0 top-full h-16 bg-gradient-to-b from-black/30 to-transparent" />}
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10 h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/images/logo-icon.png" alt="Fortress Group" width={40} height={40} className="h-9 w-auto" priority />
            <span className="flex flex-col leading-none [text-shadow:0_1px_12px_rgba(0,0,0,.9)]">
              <span className="font-display text-xl tracking-wide">Fortress <span className="text-gold-2">Group</span></span>
              <span className="text-[8px] tracking-[0.32em] uppercase text-stone/60 mt-1">Build with care</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-9 text-[13px] tracking-[0.18em] uppercase [text-shadow:0_1px_12px_rgba(0,0,0,.9)]">
            {links.slice(1, 5).map((l) => (
              <Link key={l.href} href={l.href} className={`link-underline transition-colors ${pathname.startsWith(l.href) ? "text-gold" : "text-stone/80 hover:text-stone"}`}>{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 md:gap-5">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-sm text-stone/90 hover:text-gold transition-colors [text-shadow:0_1px_12px_rgba(0,0,0,.9)]">
              <Phone size={14} /> {company.phone}
            </a>
            <Link href="/contact" className="hidden md:inline-flex items-center gap-2 rounded-full border border-gold/70 bg-ink/40 backdrop-blur px-5 py-2 text-xs tracking-[0.2em] uppercase text-gold-2 hover:bg-gold hover:text-ink transition-all duration-500">
              Book a visit
            </Link>
            <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="group relative h-11 w-11 rounded-full border border-white/25 bg-ink/40 backdrop-blur flex flex-col items-center justify-center gap-1.5 hover:border-gold/60 transition-colors">
              <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="block h-px w-5 bg-stone" />
              <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="block h-px w-5 bg-stone" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-ink-2 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_rgba(31,154,122,0.5),transparent_60%)]" />
            <div className="relative mx-auto max-w-[1600px] px-5 md:px-10 pt-32 pb-12 h-full grid lg:grid-cols-[1.2fr_1fr] gap-12 overflow-y-auto">
              <ul className="space-y-2">
                {links.map((l, i) => (
                  <motion.li key={l.href} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={l.href} className="group flex items-baseline gap-6 font-display text-5xl md:text-7xl font-light hover:text-gold transition-colors duration-500">
                      <span className="text-xs font-sans tracking-[0.3em] text-mist">0{i + 1}</span>
                      <span className="group-hover:translate-x-3 transition-transform duration-500">{l.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col justify-between gap-10">
                <div>
                  <p className="eyebrow mb-5">Sale ongoing</p>
                  <ul className="space-y-3">
                    {featuredProjects.slice(0, 5).map((p) => (
                      <li key={p.slug}>
                        <Link href={`/projects/${p.slug}`} className="flex items-center justify-between border-b hairline pb-3 text-stone/80 hover:text-gold transition-colors">
                          <span>{p.name}</span><span className="text-xs text-mist">{p.area}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-mist space-y-2">
                  <p>{company.address}</p>
                  <p className="text-stone">{company.phone} · {company.email}</p>
                  <div className="flex gap-5 pt-3">
                    {Object.entries(company.socials).map(([k, v]) => (
                      <a key={k} href={v} target="_blank" rel="noreferrer" className="capitalize text-xs tracking-widest hover:text-gold inline-flex items-center gap-1">{k}<ArrowUpRight size={12} /></a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
