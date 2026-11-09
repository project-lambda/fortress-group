import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedScroller from "@/components/FeaturedScroller";
import Stats from "@/components/Stats";
import AboutTeaser from "@/components/AboutTeaser";
import AreasGrid from "@/components/AreasGrid";
import ShowcaseGrid from "@/components/ShowcaseGrid";
import Experts from "@/components/Experts";
import Awards from "@/components/Awards";
import CTA from "@/components/CTA";
import Construction from "@/components/Construction";
import ProjectsMap from "@/components/map/ProjectsMap";
import ChapterNav from "@/components/ChapterNav";
import Film from "@/components/Film";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { projects } from "@/lib/data";
import { areas, completedProjects, featuredProjects, ongoingProjects } from "@/lib/data";

const CHAPTERS = [
  { id: "projects", label: "Sale ongoing" },
  { id: "about", label: "About us" },
  { id: "film", label: "The film" },
  { id: "build", label: "How we build" },
  { id: "areas", label: "Locations" },
  { id: "map", label: "Project map" },
  { id: "ongoing", label: "Ongoing" },
  { id: "team", label: "Sales team" },
  { id: "completed", label: "Handed over" },
  { id: "awards", label: "Awards" },
];

export default function Home() {
  const heroSlides = featuredProjects.slice(0, 5);
  return (
    <>
      <ChapterNav chapters={CHAPTERS} />
      <Hero slides={heroSlides} />
      <Marquee items={["Bashundhara R/A", "Jolshiri Abashon", "Purbachal", "Shawdesh Sornali", "Mirpur", "Uttara", "35+ Projects", "500+ Families", "ISO Certified"]} />
      <Stats />
      <div id="projects">
        <FeaturedScroller items={featuredProjects} />
        <div className="lg:hidden">
          <ShowcaseGrid eyebrow="Sale ongoing" title={<>Choose your <em className="text-gold">dream</em> project</>} items={featuredProjects} href="/projects?status=sale-ongoing" />
        </div>
      </div>
      <div id="about"><AboutTeaser /></div>
      <div id="film"><Film /></div>
      <div id="build"><Construction towers={2} eyebrow="Fortress Green Touch · Shawdesh Sornali" title={<>Two towers rising by the <em className="text-gold">lake</em></>} structure={{ basements: 2, ground: true, mezzanine: true, floors: 16, raw: "B2+B1+G+M+16", code: "B2+B1+G+M+16" }} /></div>
      <div id="areas"><AreasGrid areas={areas} /></div>
      <section id="map" className="mx-auto max-w-[1600px] px-5 md:px-10 py-24">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div><p className="eyebrow mb-3">Our presence</p><h2 className="font-display text-5xl md:text-6xl font-light leading-none">35 addresses, one <em className="text-gold">city</em></h2></div>
          <Link href="/projects" className="link-underline text-xs tracking-[0.3em] uppercase text-stone/80">Explore all projects</Link>
        </Reveal>
        <ProjectsMap projects={projects} areas={areas} compact />
      </section>
      <div id="ongoing"><ShowcaseGrid eyebrow="Ongoing" title={<>Rising across <em className="text-gold">Dhaka</em></>} items={ongoingProjects.filter((p) => !p.featured)} href="/projects?status=ongoing" /></div>
      <div id="team"><Experts /></div>
      <div id="completed"><ShowcaseGrid eyebrow="Completed" title={<>Homes already <em className="text-gold">handed over</em></>} items={completedProjects} href="/projects?status=completed" limit={3} /></div>
      <div id="awards"><Awards /></div>
      <CTA />
    </>
  );
}
