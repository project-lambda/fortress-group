import Image from "next/image";
import { Reveal, SplitWords } from "./Reveal";

export default function PageHeader({ eyebrow, title, accent, image, children }: { eyebrow: string; title: string; accent?: string; image?: string; children?: React.ReactNode }) {
  return (
    <section className="relative pt-40 pb-20 md:pt-52 md:pb-28 overflow-hidden">
      {image && (<><Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" /><div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" /></>)}
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal><p className="eyebrow mb-6">{eyebrow}</p></Reveal>
        <h1 className="font-display text-6xl md:text-8xl font-light leading-[0.95] tracking-tight">
          <SplitWords text={title} /> {accent && <em className="text-gold"><SplitWords text={accent} delay={0.3} /></em>}
        </h1>
        {children && <Reveal delay={0.3} className="mt-8 max-w-2xl text-stone/75 leading-relaxed">{children}</Reveal>}
      </div>
    </section>
  );
}
