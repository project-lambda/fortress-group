"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Select from "../Select";
import { STATUS_LABEL, type Area, type Project, type ProjectStatus } from "@/lib/data";

const DHAKA: [number, number] = [23.822, 90.455];
const CLUSTER_ZOOM = 13.5;

function clusterIcon(count: number, active: boolean) {
  const size = 44 + Math.min(count, 25) * 1.2;
  return L.divIcon({
    className: "",
    iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    html: `<div class="fg-cluster ${active ? "is-active" : ""}" style="width:${size}px;height:${size}px"><span>${count}</span><i></i></div>`,
  });
}
function pinIcon(p: Project, active: boolean) {
  return L.divIcon({
    className: "",
    iconSize: [12, 12], iconAnchor: [6, 6], popupAnchor: [0, -10],
    html: `<div class="fg-pin ${p.status} ${active ? "is-active" : ""}"><b></b><label>${p.name.replace(/^Fortress /, "")}</label></div>`,
  });
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => { onZoom(map.getZoom()); }, [map, onZoom]);
  return null;
}
function FlyTo({ target }: { target: { center: [number, number]; zoom: number; key: number } | null }) {
  const map = useMap();
  useEffect(() => { if (target) map.flyTo(target.center, target.zoom, { duration: 1.2 }); }, [target, map]);
  return null;
}

export default function ProjectsMapInner({ projects, areas, compact = false }: { projects: Project[]; areas: Area[]; compact?: boolean }) {
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 640;
  const initialZoom = isNarrow ? 11 : 12;
  const [zoom, setZoom] = useState(initialZoom);
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [area, setArea] = useState<string>("all");
  const [hover, setHover] = useState<string | null>(null);
  const [fly, setFly] = useState<{ center: [number, number]; zoom: number; key: number } | null>(null);

  const list = useMemo(() => projects.filter((p) => (status === "all" || p.status === status) && (area === "all" || p.area === area)), [projects, status, area]);
  const clusters = useMemo(() => {
    const m = new Map<string, { area: string; items: Project[]; lat: number; lng: number }>();
    for (const p of list) {
      const k = p.area ?? "Dhaka"; const c = m.get(k) ?? { area: k, items: [], lat: 0, lng: 0 }; c.items.push(p); m.set(k, c);
    }
    for (const c of m.values()) { c.lat = c.items.reduce((s, p) => s + p.lat, 0) / c.items.length; c.lng = c.items.reduce((s, p) => s + p.lng, 0) / c.items.length; }
    return [...m.values()];
  }, [list]);
  const showPins = zoom >= CLUSTER_ZOOM;

  return (
    <div className={`relative w-full ${compact ? "h-[60vh]" : "h-[78vh]"} min-h-[480px] overflow-hidden rounded-sm border hairline bg-ink-2`}>
      <MapContainer center={DHAKA} zoom={initialZoom} minZoom={10} maxZoom={17} scrollWheelZoom={false} zoomControl={false} className="h-full w-full" style={{ background: "#0b0d10" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomWatcher onZoom={setZoom} />
        <FlyTo target={fly} />
        {!showPins && clusters.map((c) => (
          <Marker key={c.area} position={[c.lat, c.lng]} icon={clusterIcon(c.items.length, hover === c.area)} eventHandlers={{ click: () => setFly({ center: [c.lat, c.lng], zoom: 15, key: Date.now() }), mouseover: () => setHover(c.area), mouseout: () => setHover(null) }} />
        ))}
        {showPins && list.map((p) => (
          <Marker key={p.slug} position={[p.lat, p.lng]} icon={pinIcon(p, hover === p.slug)} eventHandlers={{ mouseover: () => setHover(p.slug), mouseout: () => setHover(null) }}>
            <Popup closeButton={false} className="fg-popup" maxWidth={260}>
              <Link href={`/projects/${p.slug}`} className="block w-[240px] text-stone">
                <div className="relative h-32 w-full overflow-hidden">{p.image && <Image src={p.image} alt={p.name} fill sizes="240px" className="object-cover" />}</div>
                <div className="p-3">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold-2">{STATUS_LABEL[p.status]}{p.geo === "approx" ? " · approx. location" : ""}</p>
                  <p className="font-display text-xl leading-tight mt-1">{p.name}</p>
                  <p className="text-xs text-mist mt-1 flex items-center justify-between">{p.area}{p.size ? ` · ${p.size.toLocaleString()} sft` : ""}<ArrowUpRight size={12} /></p>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute left-3 right-16 bottom-3 md:left-6 md:bottom-6 md:right-auto z-[500] flex flex-row rounded-sm bg-ink/85 backdrop-blur-xl border hairline divide-x divide-white/10 text-xs md:text-sm">
        <Select value={area} onChange={(e) => { const v = e.target.value; setArea(v); const c = clusters.find((x) => x.area === v); if (c) setFly({ center: [c.lat, c.lng], zoom: 14.5, key: Date.now() }); else setFly({ center: DHAKA, zoom: initialZoom, key: Date.now() }); }} wrapClassName="min-w-0 flex-1 md:min-w-[190px]" className="px-3 md:px-5 py-3 md:py-3.5">
          <option value="all">All locations</option>
          {areas.map((a) => <option key={a.slug} value={a.name}>{a.name} ({a.count})</option>)}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")} wrapClassName="min-w-0 flex-1 md:min-w-[170px]" className="px-3 md:px-5 py-3 md:py-3.5">
          <option value="all">Project status</option>
          {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </Select>
        <div className="hidden md:flex px-5 py-3.5 text-xs tracking-[0.2em] uppercase text-mist items-center">{list.length} projects</div>
      </div>

      <div className="absolute right-3 bottom-3 md:right-6 md:bottom-6 z-[500]">
        <button onClick={() => setFly({ center: DHAKA, zoom: initialZoom, key: Date.now() })} aria-label="Reset view" className={`grid h-11 w-11 place-items-center rounded-full bg-ink/85 backdrop-blur border hairline text-stone hover:text-gold transition-colors ${showPins ? "" : "opacity-60"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="3" /></svg>
        </button>
      </div>

      <div className="absolute left-4 top-4 md:left-6 md:top-6 z-[500] hidden md:flex items-center gap-4 rounded-full bg-ink/80 backdrop-blur px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-mist border hairline">
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-gold-2" /> Sale ongoing</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-stone" /> Ongoing</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full border border-stone/60" /> Completed</span>
        <span className="text-stone/50">{showPins ? "Click a pin for details" : "Click an area to zoom in"}</span>
      </div>
    </div>
  );
}
