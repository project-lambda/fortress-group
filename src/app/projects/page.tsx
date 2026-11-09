import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import { areas, projects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Portfolio" title="Our" accent="Projects" image="/images/Galaxy.jpg">
        35 residential developments across Dhaka&apos;s most sought-after neighbourhoods — filter by status or location to find the one that feels like home.
      </PageHeader>
      <Suspense>
        <ProjectsExplorer projects={projects} areas={areas} />
      </Suspense>
    </>
  );
}
