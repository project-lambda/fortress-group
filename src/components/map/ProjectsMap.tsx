"use client";
import dynamic from "next/dynamic";
import type { Area, Project } from "@/lib/data";

const Inner = dynamic(() => import("./ProjectsMapInner"), { ssr: false, loading: () => <div className="h-[78vh] min-h-[480px] rounded-sm border hairline bg-ink-2 animate-pulse" /> });

export default function ProjectsMap(props: { projects: Project[]; areas: Area[]; compact?: boolean }) {
  return <Inner {...props} />;
}
