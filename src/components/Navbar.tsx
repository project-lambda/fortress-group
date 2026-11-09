"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone, ArrowUpRight, ChevronDown } from "lucide-react";
import { ABOUT_LINKS, CONCERN_LINKS, company, featuredProjects } from "@/lib/data";
import ShortlistLink from "./ShortlistLink";
import ThemeToggle from "./ThemeToggle";

type NavLink = { href: string; label: string; children?: { href: string; label: string }[] };
const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About", children: ABOUT_LINKS },
  { href: "/concerns", label: "Our Concerns", children: CONCERN_LINKS },
  { href: "/team", label: "Leadership" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
  { href: "/shortlist", label: "Shortlist" },
];
const desktop = links.filter((l) => ["/projects", "/about", "/concerns", "/team", "/news"].includes(l.href));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); setMenu(null); }
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Over full-bleed photography (home hero, project hero) the header keeps its dark styling in both themes.
  const overPhoto = !scrolled && !open && (pathname === "/" || /^\/projects\/[^/]+$/.test(pathname));
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${overPhoto ? "theme-dark" : ""} ${scrolled && !open ? "bg-ink/80 backdrop-blur-xl border-b hairline" : open ? "" : overPhoto ? "bg-gradient-to-b from-black/85 via-black/50 to-transparent backdrop-blur-[2px]" : "bg-gradient-to-b from-ink/90 via-ink/50 to-transparent backdrop-blur-[2px]"}`}>
        {overPhoto && <div className="pointer-events-none absolute inset-x-0 top-full h-16 bg-gradient-to-b from-black/30 to-transparent" />}
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10 h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/images/logo-icon.png" alt="Fortress Group" width={40} height={40} className="h-9 w-auto" priority />
            <span className="flex flex-col leading-none nav-glow">
              <span className="font-display text-xl tracking-wide">Fortress <span className="text-gold-2">Group</span></span>
              <span className="text-[8px] tracking-[0.32em] uppercase text-stone/60 mt-1">Build with care</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.18em] uppercase nav-glow" onMouseLeave={() => setMenu(null)}>
            {desktop.map((l) => {
              const active = pathname.startsWith(l.href) || (l.href === "/about" && pathname.startsWith("/about"));
              return (
                <div key={l.href} className="relative py-2" onMouseEnter={() => setMenu(l.children ? l.href : null)}>
                  <Link href={l.href} className={`inline-flex items-center gap-1.5 link-underline transition-colors ${active ? "text-gold" : "text-stone/80 hover:text-stone"}`}>
                    {l.label}{l.children && <ChevronDown size={12} className={`transition-transform duration-300 ${menu === l.href ? "rotate-180" : ""}`} />}
                  </Link>
                  <AnimatePresence>
                    {l.children && menu === l.href && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }} className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                        <ul className="min-w-72 rounded-sm border hairline bg-ink-2/95 backdrop-blur-xl p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] normal-case tracking-normal [text-shadow:none]">
                          {l.children.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} className={`flex items-center justify-between gap-6 rounded-sm px-4 py-2.5 text-sm transition-colors ${pathname === c.href ? "bg-gold/10 text-gold-2" : "text-stone/85 hover:bg-fg/5 hover:text-gold-2"}`}>
                                {c.label}<ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 transition-all" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 md:gap-5">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-sm text-stone/90 hover:text-gold transition-colors nav-glow">
              <Phone size={14} /> {company.phone}
            </a>
            <Link href="/contact" className="hidden md:inline-flex items-center gap-2 rounded-full border border-gold/70 bg-ink/40 backdrop-blur px-5 py-2 text-xs tracking-[0.2em] uppercase text-gold-2 hover:bg-gold hover:text-ink transition-all duration-500">
              Book a visit
            </Link>
            <ThemeToggle className="hidden sm:grid" />
            <ShortlistLink />
            <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="group relative h-11 w-11 rounded-full border border-fg/25 bg-ink/40 backdrop-blur flex flex-col items-center justify-center gap-1.5 hover:border-gold/60 transition-colors">
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
              <ul className="space-y-2 min-w-0">
                {links.map((l, i) => (
                  <motion.li key={l.href} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={l.href} className="group flex items-baseline gap-6 font-display text-4xl md:text-6xl font-light hover:text-gold transition-colors duration-500">
                      <span className="text-xs font-sans tracking-[0.3em] text-mist">0{i + 1}</span>
                      <span className="group-hover:translate-x-3 transition-transform duration-500">{l.label}</span>
                    </Link>
                    {l.children && (
                      <ul className="ml-12 mt-2 mb-4 grid grid-cols-1 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-5">
                        {l.children.filter((c) => c.href !== l.href).map((c) => (
                          <li key={c.href}><Link href={c.href} className="text-xs tracking-[0.15em] uppercase text-stone/60 hover:text-gold-2 transition-colors">{c.label}</Link></li>
                        ))}
                      </ul>
                    )}
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
                  <div className="sm:hidden flex items-center gap-3 mb-4"><ThemeToggle /><span className="text-xs tracking-[0.2em] uppercase">Day / night</span></div>
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
