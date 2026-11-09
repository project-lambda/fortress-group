"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { projects } from "@/lib/data";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm border border-gold/40 bg-ink-2 p-10 text-center"><p className="font-display text-4xl font-light mb-3">Thank you.</p><p className="text-stone/70">Our team will reach out shortly.</p></motion.div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid sm:grid-cols-2 gap-4">
      <input required placeholder="Full name" className="rounded-sm border hairline bg-ink-2 px-4 py-3.5 text-sm outline-none focus:border-gold/60" />
      <input required type="tel" placeholder="Phone" className="rounded-sm border hairline bg-ink-2 px-4 py-3.5 text-sm outline-none focus:border-gold/60" />
      <input type="email" placeholder="Email" className="rounded-sm border hairline bg-ink-2 px-4 py-3.5 text-sm outline-none focus:border-gold/60 sm:col-span-2" />
      <select className="rounded-sm border hairline bg-ink-2 px-4 py-3.5 text-sm outline-none focus:border-gold/60 sm:col-span-2 text-stone/80">
        <option value="">Interested project (optional)</option>
        {projects.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
      </select>
      <textarea rows={4} placeholder="How can we help?" className="rounded-sm border hairline bg-ink-2 px-4 py-3.5 text-sm outline-none focus:border-gold/60 sm:col-span-2" />
      <button className="sm:col-span-2 rounded-sm bg-gold py-4 text-xs tracking-[0.25em] uppercase text-ink hover:bg-gold-2 transition-colors">Send message</button>
    </form>
  );
}
