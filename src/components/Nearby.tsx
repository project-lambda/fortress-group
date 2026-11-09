import { Clock, Navigation } from "lucide-react";
import type { Project } from "@/lib/data";

const LANDMARKS = [
  { name: "Hazrat Shahjalal Int'l Airport", lat: 23.8433, lng: 90.3978 },
  { name: "Gulshan 2 Circle", lat: 23.7946, lng: 90.4142 },
  { name: "Kuril · 300 Feet Expressway", lat: 23.8215, lng: 90.4225 },
  { name: "Jamuna Future Park", lat: 23.8135, lng: 90.4245 },
  { name: "Motijheel business district", lat: 23.7330, lng: 90.4172 },
];

function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, d = Math.PI / 180;
  const dLat = (bLat - aLat) * d, dLng = (bLng - aLng) * d;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * d) * Math.cos(bLat * d) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function Nearby({ p }: { p: Project }) {
  const rows = LANDMARKS.map((l) => {
    const road = km(p.lat, p.lng, l.lat, l.lng) * 1.3; // route factor over straight line
    const mins = Math.max(5, Math.round((road / 22) * 60 / 5) * 5); // ~22 km/h city average
    return { ...l, road, mins };
  }).sort((a, b) => a.road - b.road);
  return (
    <div className="rounded-sm border hairline bg-ink-2 p-7">
      <p className="eyebrow mb-1">Getting around</p>
      <h3 className="font-display text-2xl font-light mb-5">From {p.name.replace(/^Fortress /, "")}</h3>
      <ul className="divide-y hairline">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-stone/85">{r.name}</span>
            <span className="flex items-center gap-4 text-mist whitespace-nowrap">
              <span className="inline-flex items-center gap-1"><Navigation size={11} /> {r.road.toFixed(1)} km</span>
              <span className="inline-flex items-center gap-1 text-gold-2"><Clock size={11} /> ~{r.mins} min</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-relaxed text-mist">Drive-time estimates from road distance at a typical Dhaka pace, off-peak.{p.geo === "approx" ? " Project position is approximate until surveyed coordinates are added." : ""}</p>
    </div>
  );
}
