"use client";
import { useCallback, useSyncExternalStore } from "react";

const KEY = "fg:shortlist";
const EVT = "fg:shortlist";
const EMPTY: string[] = [];
let cacheRaw: string | null = null;
let cache: string[] = EMPTY;

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : EMPTY;
    return cache;
  } catch {
    return EMPTY;
  }
}
function write(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* private mode */ }
  window.dispatchEvent(new Event(EVT));
}
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
}

export function useShortlist() {
  const slugs = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((slug: string) => {
    const cur = read();
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);
  const remove = useCallback((slug: string) => write(read().filter((s) => s !== slug)), []);
  const clear = useCallback(() => write([]), []);
  return { slugs, has: (slug: string) => slugs.includes(slug), toggle, remove, clear };
}
