import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { getProject, projects, relatedProjects } from "@/lib/data";

export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return { title: p?.title ?? "Project" };
}
async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  return <ProjectDetail p={p} related={relatedProjects(p)} />;
}

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <Suspense><Content {...props} /></Suspense>;
}
