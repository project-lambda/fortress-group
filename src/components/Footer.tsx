import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { company, areas } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t hairline bg-ink-2">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/images/main-logo.png" alt="Fortress Group" width={48} height={40} className="h-10 w-auto" />
              <span className="font-display text-2xl">Fortress <span className="text-gold">Group</span></span>
            </div>
            <p className="text-sm leading-relaxed text-mist max-w-md">{company.about}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {company.sisterConcerns.map((c) => (
                <span key={c} className="rounded-full border hairline px-3 py-1 text-[11px] tracking-wider text-stone/70">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-6">Explore</p>
            <ul className="space-y-3 text-sm text-stone/80">
              {[["/projects", "All Projects"], ["/projects?status=sale-ongoing", "Sale Ongoing"], ["/projects?status=completed", "Completed"], ["/about", "About Us"], ["/team", "Leadership"], ["/news", "News & Events"], ["/contact", "Contact"]].map(([h, l]) => (
                <li key={h}><Link href={h} className="hover:text-gold transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6">Locations</p>
            <ul className="space-y-3 text-sm text-stone/80">
              {areas.map((a) => (
                <li key={a.slug}><Link href={`/projects?area=${a.slug}`} className="hover:text-gold transition-colors flex justify-between"><span>{a.name}</span><span className="text-mist">{a.count}</span></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6">Contact</p>
            <address className="not-italic text-sm text-stone/80 space-y-3 leading-relaxed">
              <p>{company.address}</p>
              <p><a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-gold">{company.phone}</a><br /><a href={`tel:${company.phone2.replace(/\s/g, "")}`} className="hover:text-gold">{company.phone2}</a></p>
              <p><a href={`mailto:${company.email}`} className="hover:text-gold">{company.email}</a></p>
            </address>
            <div className="mt-6 flex flex-wrap gap-4">
              {Object.entries(company.socials).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer" className="text-xs tracking-widest uppercase text-mist hover:text-gold inline-flex items-center gap-1">{k}<ArrowUpRight size={11} /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t hairline pt-8 text-xs text-mist">
          <p>© {new Date().getFullYear()} Fortress Group. All rights reserved.</p>
          <p className="tracking-[0.3em] uppercase">ISO Certified · Dhaka, Bangladesh</p>
        </div>
      </div>
      <div className="pointer-events-none select-none overflow-hidden">
        <p className="font-display text-[18vw] leading-[0.8] text-center text-stroke opacity-40 -mb-[4vw]">FORTRESS</p>
      </div>
    </footer>
  );
}
