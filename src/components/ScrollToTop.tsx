"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; }, []);
  useEffect(() => {
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
  }, [pathname, lenis]);
  return null;
}
