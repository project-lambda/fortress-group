export interface Lead {
  name: string;
  phone: string;
  email?: string;
  project?: string;
  message?: string;
  source: string;
}

export function validateLead(body: unknown): { ok: true; lead: Lead } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid payload" };
  const b = body as Record<string, unknown>;
  const str = (k: string, max = 500) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");
  if (str("company")) return { ok: false, error: "Spam detected" }; // honeypot
  const name = str("name", 120);
  const phone = str("phone", 40);
  const email = str("email", 160);
  if (name.length < 2) return { ok: false, error: "Please enter your name" };
  if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) return { ok: false, error: "Please enter a valid phone number" };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email" };
  return { ok: true, lead: { name, phone, email: email || undefined, project: str("project", 160) || undefined, message: str("message", 2000) || undefined, source: str("source", 200) || "website" } };
}

export function leadToText(l: Lead) {
  return [
    `New enquiry from fortressgroup website`,
    ``,
    `Name: ${l.name}`,
    `Phone: ${l.phone}`,
    l.email ? `Email: ${l.email}` : null,
    l.project ? `Project: ${l.project}` : null,
    l.message ? `Message: ${l.message}` : null,
    ``,
    `Source: ${l.source}`,
  ].filter((x) => x !== null).join("\n");
}

export function whatsappUrl(l: Partial<Lead>, number = "8801404040171") {
  const text = [
    `Hello Fortress Group, I'm ${l.name ?? ""}.`,
    l.project ? `I'm interested in ${l.project}.` : `I'd like to know more about your projects.`,
    l.message ?? "",
    l.phone ? `My number: ${l.phone}` : "",
  ].filter(Boolean).join(" ");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
