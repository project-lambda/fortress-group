import type { Project } from "./data";

export interface Fact { key: string; label: string; value: string }
export interface AmenityGroup { key: "inside" | "lifestyle" | "safety"; title: string; subtitle: string; items: string[] }
export interface Structure { basements: number; ground: boolean; mezzanine: boolean; floors: number; raw: string; code: string }
export interface ParsedProject {
  intro: string[];
  note: string | null;
  facts: Fact[];
  groups: AmenityGroup[];
  structure: Structure | null;
  mapUrl: string | null;
}

const BN_DIGITS: Record<string, string> = { "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" };
export const bnToEn = (s: string) => s.replace(/[০-৯]/g, (d) => BN_DIGITS[d]);

const clean = (s: string) => bnToEn(s).replace(/^[✅📍>\-•\s]+/, "").replace(/\s+/g, " ").trim();

// Bangla / English label → canonical fact key
const FACT_RULES: { key: string; label: string; re: RegExp; fmt?: (v: string) => string }[] = [
  { key: "address", label: "Address", re: /^(address|লোকেশন)\s*[-:–]?\s*(.+)$/i },
  { key: "facing", label: "Facing", re: /^facing\s*[-:–]?\s*(.+)$/i },
  { key: "structure", label: "Building", re: /^(apartment type|বিল্ডিং)\s*[-:–]?\s*(.+)$/i },
  { key: "units", label: "Units per floor", re: /^(unit|প্রতি ফ্লোরে ইউনিট)\s*[-:–]?\s*(.+?)(?:\s*টি)?$/i },
  { key: "bedrooms", label: "Bedrooms", re: /^(?:bedrooms?\s*[-:–]?\s*(\d+)|(\d+)\s*বেড)$/i },
  { key: "bathrooms", label: "Bathrooms", re: /^(?:bathrooms?\s*[-:–]?\s*(\d+)|(\d+)\s*বাথ)$/i },
  { key: "balconies", label: "Balconies", re: /^(\d+)\s*বারান্দা$/i },
  { key: "road", label: "Front road", re: /^(?:fr?ont road|পূর্বে|দক্ষিণে|উত্তরে|পশ্চিমে)\s*[-:–]?\s*(.+)$/i },
  { key: "parking", label: "Parking", re: /^(?:parking|পার্কিং সংখ্যা)\s*[-:–]?\s*(\d+)/i },
  { key: "area", label: "Apartment size", re: /^flat area\s*[-:–]?\s*(.+)$/i },
  { key: "land", label: "Land size", re: /^(?:land size|জমির পরিমাণ)\s*[-:–]?\s*(.+)$/i, fmt: (v) => v.replace(/কাঠা/, "Katha") },
  { key: "towers", label: "Towers", re: /^টাওয়ার\s*(\d+)/i },
  { key: "flatsPerTower", label: "Flats per tower", re: /^প্রতি টাওয়ারে ফ্ল্যাট সংখ্যা\s*[-:–]?\s*(\d+)/i },
  { key: "totalFlats", label: "Total apartments", re: /^মোট ফ্ল্যাট সংখ্যা\s*[-:–]?\s*(\d+)/i },
];

const AMENITY_MAP: { re: RegExp; en: string; group: AmenityGroup["key"] }[] = [
  { re: /ফরমাল লিভিং/, en: "Formal living room", group: "inside" },
  { re: /ফ্যামেলি লিভিং|family living/i, en: "Family living room", group: "inside" },
  { re: /^ডাইনিং$|dining/i, en: "Dining space", group: "inside" },
  { re: /^কিচেন$|kitchen/i, en: "Modern kitchen", group: "inside" },
  { re: /সার্ভেন্ট বাথ|servant/i, en: "Servant bath", group: "inside" },
  { re: /সুইমিং পুল|swimming/i, en: "Swimming pool", group: "lifestyle" },
  { re: /হেলথ ক্লাব|জীম|gym/i, en: "Health club & gym", group: "lifestyle" },
  { re: /বার-বি-কিউ|bbq|barbe/i, en: "BBQ corner", group: "lifestyle" },
  { re: /কমিউনিটি হল|community/i, en: "Community hall", group: "lifestyle" },
  { re: /প্রেয়ার রুম|prayer/i, en: "Prayer room", group: "lifestyle" },
  { re: /কিডস|kids/i, en: "Kids play zone", group: "lifestyle" },
  { re: /রিক্রেশন|recreation/i, en: "Recreation zone", group: "lifestyle" },
  { re: /ব্যাডমিন্টন|badminton/i, en: "Badminton court", group: "lifestyle" },
  { re: /ওয়াক ওয়ে|walkway/i, en: "Landscaped walkway", group: "lifestyle" },
  { re: /মিনি পা|mini park/i, en: "Mini park", group: "lifestyle" },
  { re: /মিনিশপ|mini ?shop/i, en: "Mini shop", group: "lifestyle" },
  { re: /চেঞ্জিং রুম|changing/i, en: "Changing rooms", group: "lifestyle" },
  { re: /ওয়েটিং লাউঞ্জ|lounge/i, en: "Waiting lounge", group: "lifestyle" },
  { re: /ওয়াটার বডি|water body/i, en: "Water body", group: "lifestyle" },
  { re: /অফিস রুম|office/i, en: "Management office", group: "safety" },
  { re: /সিসিটিভি|cctv/i, en: "CCTV monitoring", group: "safety" },
  { re: /প্যাসেঞ্জার লিফট|lift|elevator/i, en: "Passenger lifts", group: "safety" },
  { re: /সাব-স্টেশন|জেনারেটর|generator|substation/i, en: "Substation & generator", group: "safety" },
  { re: /ইভি চার্জিং|ev charg/i, en: "EV charging zone", group: "safety" },
  { re: /গার্ড রুম|guard/i, en: "Guard room", group: "safety" },
  { re: /^সিঁড়ি$|stair/i, en: "Fire stairs", group: "safety" },
  { re: /কারওয়াশ|car ?wash/i, en: "Car wash bay", group: "safety" },
  { re: /ওয়াশ রুম|wash ?room/i, en: "Common washrooms", group: "safety" },
];

const GROUP_META: Record<AmenityGroup["key"], { title: string; subtitle: string }> = {
  inside: { title: "Inside your apartment", subtitle: "Planned for the way families actually live" },
  lifestyle: { title: "Lifestyle & community", subtitle: "Shared spaces across the open landscape" },
  safety: { title: "Safety & utilities", subtitle: "Quietly working around the clock" },
};

export function parseStructure(raw: string): Structure | null {
  const s = bnToEn(raw).toUpperCase().replace(/বি/g, "B").replace(/জি/g, "G").replace(/এম/g, "M").replace(/\s/g, "");
  const parts = s.split("+").filter(Boolean);
  if (parts.length < 2) return null;
  let basements = 0, ground = false, mezzanine = false, floors = 0;
  for (const p of parts) {
    if (/^B\d?$/.test(p)) basements += 1;
    else if (p === "G") ground = true;
    else if (p === "M") mezzanine = true;
    else if (/^\d+$/.test(p)) floors = Math.max(floors, parseInt(p, 10));
  }
  const code = [...Array.from({ length: basements }, (_, i) => `B${basements - i}`), ground ? "G" : null, mezzanine ? "M" : null, String(floors)].filter(Boolean).join("+");
  return floors ? { basements, ground, mezzanine, floors, raw, code } : null;
}

export function parseProject(p: Project): ParsedProject {
  const facts = new Map<string, Fact>();
  const groupItems: Record<AmenityGroup["key"], string[]> = { inside: [], lifestyle: [], safety: [] };
  const intro: string[] = [];
  let note: string | null = null;
  let mapUrl: string | null = null;
  const roads: string[] = [];

  for (const raw of p.description) {
    const l = clean(raw);
    if (!l) continue;
    if (/^https?:\/\//.test(l)) { mapUrl = l; continue; }
    if (/^google (map|location)$/i.test(l) || /^project name/i.test(l)) continue;
    if (/যা যা থাক/.test(l)) continue; // section headers
    if (/^বি\s*:\s*দ্র|^note/i.test(l)) { note = l.replace(/^বি\s*:\s*দ্র\s*:?\s*/, ""); continue; }

    let matched = false;
    for (const r of FACT_RULES) {
      const m = l.match(r.re);
      if (!m) continue;
      const v = (m[2] ?? m[1] ?? "").trim();
      if (!v) continue;
      if (r.key === "road") {
        const dir = l.match(/^(পূর্বে|দক্ষিণে|উত্তরে|পশ্চিমে)/)?.[1];
        const en = dir ? ({ "পূর্বে": "East", "দক্ষিণে": "South", "উত্তরে": "North", "পশ্চিমে": "West" } as Record<string, string>)[dir] : null;
        roads.push(en ? `${en} ${v.replace(/ফিট রাস্তা/, "ft")}` : v.replace(/[’‘']/g, "'"));
      } else {
        facts.set(r.key, { key: r.key, label: r.label, value: r.fmt ? r.fmt(v) : v.replace(/আবাসিক।?$/, "Abashik").replace(/ব্লক/, "Block") });
      }
      matched = true; break;
    }
    if (matched) continue;

    const am = AMENITY_MAP.find((a) => a.re.test(l));
    if (am) { if (!groupItems[am.group].includes(am.en)) groupItems[am.group].push(am.en); continue; }

    if (l.length > 40) intro.push(l);
  }
  if (roads.length) facts.set("road", { key: "road", label: roads.length > 1 ? "Road access" : "Front road", value: roads.join(" · ") });

  // derive bedrooms/baths/balconies into "inside" group chips as well
  const bd = facts.get("bedrooms"), bt = facts.get("bathrooms"), bl = facts.get("balconies");
  const inside = [bd && `${parseInt(bd.value)} bedrooms`, bt && `${parseInt(bt.value)} bathrooms`, bl && `${parseInt(bl.value)} balconies`].filter(Boolean) as string[];
  groupItems.inside = [...inside, ...groupItems.inside];

  const structure = facts.has("structure") ? parseStructure(facts.get("structure")!.value) : null;
  if (structure) facts.set("structure", { ...facts.get("structure")!, value: describeStructure(structure) });

  const order = ["area", "bedrooms", "bathrooms", "balconies", "structure", "units", "parking", "land", "facing", "road", "towers", "flatsPerTower", "totalFlats", "address"];
  const factList = order.map((k) => facts.get(k)).filter(Boolean) as Fact[];
  if (!facts.has("area") && p.size) factList.unshift({ key: "area", label: "Apartment size", value: `${p.size.toLocaleString()} SFT` });

  const groups = (["inside", "lifestyle", "safety"] as const).filter((k) => groupItems[k].length).map((k) => ({ key: k, ...GROUP_META[k], items: groupItems[k] }));
  return { intro, note, facts: factList, groups, structure, mapUrl };
}

export function describeStructure(s: Structure) {
  const bits: string[] = [];
  if (s.basements) bits.push(`${s.basements} basement${s.basements > 1 ? "s" : ""}`);
  if (s.ground) bits.push("ground");
  if (s.mezzanine) bits.push("mezzanine");
  bits.push(`${s.floors} residential floors`);
  return bits.join(" + ");
}
