import Link from "next/link";
import { ArrowUpRight, Hourglass } from "lucide-react";
import { Reveal } from "./Reveal";
import { company } from "@/lib/data";

export default function ComingSoon({ what, children }: { what: string; children?: React.ReactNode }) {
  return (
    <Reveal className="rounded-sm border border-gold/30 bg-gold/5 p-8 md:p-10 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/50 text-gold"><Hourglass size={20} /></span>
      <div>
        <p className="font-display text-2xl md:text-3xl font-light">{what} is being prepared</p>
        <p className="mt-2 text-sm text-stone/70 leading-relaxed">{children ?? `Fortress Group is finalising the official ${what.toLowerCase()} page. Until then, our team is happy to answer any question directly.`}</p>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs tracking-[0.25em] uppercase text-ink hover:bg-gold-2 transition-colors">Ask us <ArrowUpRight size={13} /></Link>
        <a href={`mailto:${company.email}`} className="text-center text-xs text-mist hover:text-gold">{company.email}</a>
      </div>
    </Reveal>
  );
}
