import { NextResponse } from "next/server";
import { leadToText, validateLead } from "@/lib/lead";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

// The static GitHub Pages build at emroze.dev posts here cross-origin.
const ALLOWED_ORIGINS = ["https://emroze.dev", "http://localhost:3000"];
function cors(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const h: Record<string, string> = { Vary: "Origin" };
  if (ALLOWED_ORIGINS.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}
export function OPTIONS(req: Request) { return new Response(null, { status: 204, headers: cors(req) }); }

function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

async function sendEmail(subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? "Fortress Website <onboarding@resend.dev>";
  if (!key || !to) {
    console.log(`[lead] email not configured (set RESEND_API_KEY and LEAD_TO_EMAIL). Lead:\n${text}`);
    return { delivered: false as const };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject, text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return { delivered: true as const };
}

export async function POST(req: Request) {
  const headers = cors(req);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Too many requests, please try again in a minute." }, { status: 429, headers });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers }); }

  const v = validateLead(body);
  if (!v.ok) return NextResponse.json({ ok: false, error: v.error }, { status: 400, headers });

  try {
    const subject = v.lead.project ? `Enquiry: ${v.lead.project} — ${v.lead.name}` : `Website enquiry — ${v.lead.name}`;
    const { delivered } = await sendEmail(subject, leadToText(v.lead));
    return NextResponse.json({ ok: true, delivered }, { headers });
  } catch (e) {
    console.error("[lead] send failed", e);
    return NextResponse.json({ ok: false, error: "Could not send your message. Please call us or use WhatsApp." }, { status: 502, headers });
  }
}
