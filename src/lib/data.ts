import site from "@/data/site.json";

export type ProjectStatus = "sale-ongoing" | "ongoing" | "completed" | "upcoming";

export interface Project {
  id: number;
  slug: string;
  title: string;
  name: string;
  size: number | null;
  area: string | null;
  status: ProjectStatus;
  image: string | null;
  gallery: string[];
  description: string[];
  date: string;
  featured: boolean;
  lat: number;
  lng: number;
  geo: "exact" | "approx";
}

export interface Person {
  slug: string;
  name: string;
  role: string;
  image: string | null;
  bio: string[];
}

export interface Area { slug: string; name: string; image: string; count: number }
export interface Award { slug: string; title: string; image: string | null; description: string }
export interface Concern { slug: string; title: string; image: string | null }
export interface NewsItem { slug: string; title: string; image: string | null; date: string }

export const company = site.company;
export const projects = site.projects as Project[];
export const areas = site.areas as Area[];
export const directors = site.directors as Person[];
const EXPERT_RANK = ["team leader", "deputy manager (sales & marketing)", "deputy manager", "asst. manager", "senior executive"];
const rank = (role: string) => { const r = role.toLowerCase(); const i = EXPERT_RANK.findIndex((k) => r.startsWith(k)); return i === -1 ? EXPERT_RANK.length : i; };
export const experts = [...(site.experts as Person[])].sort((a, b) => rank(a.role) - rank(b.role));
export const awards = site.awards as Award[];
export const concerns = site.concerns as Concern[];
export const news = site.news as NewsItem[];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  "sale-ongoing": "Sale Ongoing",
  ongoing: "Ongoing",
  completed: "Completed",
  upcoming: "Upcoming",
};

export const featuredProjects = projects.filter((p) => p.featured && p.image);
export const completedProjects = projects.filter((p) => p.status === "completed");
export const ongoingProjects = projects.filter((p) => p.status === "ongoing" || p.status === "sale-ongoing");

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
export function getPerson(slug: string) {
  return [...directors, ...experts].find((p) => p.slug === slug);
}
export function shortName(p: Project) {
  return p.name.replace(/^Fortress\s+/i, "");
}
export function relatedProjects(p: Project, n = 4) {
  return projects.filter((x) => x.slug !== p.slug && x.image && (x.area === p.area || x.status === p.status)).slice(0, n);
}

export const stats = [
  { value: 35, suffix: "+", label: "Residential projects" },
  { value: 500, suffix: "+", label: "Happy families" },
  { value: 6, suffix: "", label: "Prime locations in Dhaka" },
  { value: 20, suffix: "+", label: "Years of trust" },
];
