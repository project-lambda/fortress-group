import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import ProjectsMap from "@/components/map/ProjectsMap";
import { Reveal } from "@/components/Reveal";
import { areas, projects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Portfolio" title="Our" accent="Projects" image="/images/Galaxy.jpg">
        35 residential developments across Dhaka&apos;s most sought-after neighbourhoods — filter by status or location to find the one that feels like home.
      </PageHeader>
      <section className="mx-auto max-w-[1600px] px-5 md:px-10 pb-20">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div><p className="eyebrow mb-3">Our presence</p><h2 className="font-display text-4xl md:text-5xl font-light">Across <em className="text-gold">Dhaka</em></h2></div>
          <p className="text-sm text-mist max-w-sm">Click an area to zoom in, then a pin for the project. Positions marked approximate are placed by block until surveyed coordinates are added.</p>
        </Reveal>
        <ProjectsMap projects={projects} areas={areas} />
      </section>
      <Suspense>
        <ProjectsExplorer projects={projects} areas={areas} />
      </Suspense>
    </>
  );
}
