"use client";
import { useEffect, useState } from "react";
export default function Year() {
  const [y, setY] = useState(2026);
  useEffect(() => { const t = setTimeout(() => setY(new Date().getFullYear()), 0); return () => clearTimeout(t); }, []);
  return <>{y}</>;
}
