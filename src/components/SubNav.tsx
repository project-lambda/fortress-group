"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Section" className="sticky top-20 z-30 border-y hairline bg-ink/80 backdrop-blur-xl">
      <ul className="mx-auto max-w-[1600px] flex gap-1 overflow-x-auto scrollbar-none px-5 md:px-10 py-3">
        {links.map((l) => {
          const on = pathname === l.href;
          return (
            <li key={l.href} className="shrink-0">
              <Link href={l.href} className={`block whitespace-nowrap rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${on ? "bg-gold text-ink" : "text-stone/70 hover:text-stone hover:bg-fg/5"}`}>{l.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
