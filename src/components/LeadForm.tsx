"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Loader2, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/lead";
import Select from "./Select";

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadForm({
  source,
  project,
  projects,
  compact = false,
  submitLabel = "Send message",
  initialMessage = "",
}: {
  source: string;
  project?: string;
  projects?: { slug: string; title: string }[];
  compact?: boolean;
  submitLabel?: string;
  initialMessage?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [delivered, setDelivered] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", email: "", project: project ?? "", message: initialMessage, company: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending"); setError("");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, source }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong");
      setDelivered(Boolean(data.delivered));
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const input = "w-full rounded-sm border hairline bg-ink px-4 py-3 text-sm outline-none focus:border-gold/60 placeholder:text-mist";
  const wa = whatsappUrl({ name: form.name, phone: form.phone, project: form.project || project, message: form.message });

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm border border-gold/40 bg-ink p-8 text-center">
          <p className="font-display text-4xl font-light mb-3">Thank you, {form.name.split(" ")[0]}.</p>
          <p className="text-stone/70 text-sm">{delivered ? "Your enquiry has been sent. Our team will call you shortly." : "Your enquiry has been received. Our team will call you shortly."}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#25D366]/60 px-5 py-2.5 text-xs tracking-[0.2em] uppercase text-[#25D366] hover:bg-[#25D366] hover:text-ink transition-colors">
            <MessageCircle size={14} /> Continue on WhatsApp
          </a>
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-4"} noValidate>
          <input tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} name="company" className="hidden" aria-hidden />
          <input required value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" className={input} />
          <input required value={form.phone} onChange={set("phone")} type="tel" placeholder="Phone number" autoComplete="tel" className={input} />
          {!compact && <input value={form.email} onChange={set("email")} type="email" placeholder="Email (optional)" autoComplete="email" className={`${input} sm:col-span-2`} />}
          {projects && (
            <Select value={form.project} onChange={set("project")} wrapClassName="sm:col-span-2 rounded-sm border hairline bg-ink focus-within:border-gold/60" className="px-4 py-3 text-sm text-stone/80">
              <option value="">Interested project (optional)</option>
              {projects.map((p) => <option key={p.slug} value={p.title}>{p.title}</option>)}
            </Select>
          )}
          <textarea value={form.message} onChange={set("message")} placeholder={compact ? "Message (optional)" : "How can we help?"} rows={compact ? 3 : 4} className={`${input} ${compact ? "" : "sm:col-span-2"}`} />
          {status === "error" && <p className={`text-sm text-red-400 ${compact ? "" : "sm:col-span-2"}`}>{error}</p>}
          <button disabled={status === "sending"} className={`inline-flex items-center justify-center gap-2 rounded-sm bg-gold py-3.5 text-xs tracking-[0.25em] uppercase text-ink hover:bg-gold-2 transition-colors disabled:opacity-60 ${compact ? "w-full" : "sm:col-span-2"}`}>
            {status === "sending" ? <><Loader2 size={14} className="animate-spin" /> Sending</> : submitLabel}
          </button>
          <a href={wa} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-sm border border-[#25D366]/50 py-3 text-xs tracking-[0.2em] uppercase text-[#25D366] hover:bg-[#25D366]/10 transition-colors ${compact ? "w-full" : "sm:col-span-2"}`}>
            <MessageCircle size={14} /> Chat on WhatsApp <ArrowUpRight size={12} />
          </a>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
