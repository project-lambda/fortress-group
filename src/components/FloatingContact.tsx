"use client";
import { MessageCircle, Phone } from "lucide-react";
import { company } from "@/lib/data";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3">
      <a href={company.socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-ink shadow-lg shadow-black/40 hover:scale-110 transition-transform"><MessageCircle size={20} /></a>
      <a href={`tel:${company.phone.replace(/\s/g, "")}`} aria-label="Call" className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink shadow-lg shadow-black/40 hover:scale-110 transition-transform"><Phone size={18} /></a>
    </div>
  );
}
