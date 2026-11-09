import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShortlistView from "@/components/ShortlistView";
import { projects } from "@/lib/data";

export const metadata: Metadata = { title: "Your shortlist" };

export default function ShortlistPage() {
  return (
    <>
      <PageHeader eyebrow="Saved for later" title="Your" accent="shortlist" image="/images/Galaxy.jpg">
        Tap the heart on any project to keep it here. Compare sizes, locations and building plans side by side, then send the whole list to our sales team in one go.
      </PageHeader>
      <ShortlistView projects={projects} />
    </>
  );
}
