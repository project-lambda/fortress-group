import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { company } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact us" title="Let's find your" accent="home." image="/images/Crystal-Park.jpg">
        Visit our head office in Bashundhara, call our hotline, or leave your details and we&apos;ll call you back.
      </PageHeader>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-28 grid lg:grid-cols-[0.9fr_1.1fr] gap-16">
        <div className="space-y-10">
          {[
            { I: MapPin, k: "Head office", v: company.address },
            { I: Phone, k: "Hotline", v: `${company.phone} · ${company.phone2}` },
            { I: Mail, k: "Email", v: company.email },
          ].map(({ I, k, v }, i) => (
            <Reveal key={k} delay={i * 0.1} className="flex gap-5 border-b hairline pb-8">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/50 text-gold"><I size={18} /></span>
              <div><p className="eyebrow mb-2">{k}</p><p className="text-stone/85 leading-relaxed">{v}</p></div>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="overflow-hidden rounded-sm border hairline">
            <iframe title="Fortress Group office" loading="lazy" className="h-80 w-full grayscale invert-[0.9] contrast-[0.9]" src="https://www.google.com/maps?q=Business%20Point%2C%20Block%20I%2C%20Bashundhara%20R%2FA%2C%20Dhaka&output=embed" />
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <h2 className="font-display text-4xl font-light mb-8">Request a <em className="text-gold">callback</em></h2>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
