"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// The board lives on /team; this alias just forwards (client-side so it also works in the static export).
export default function BoardPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/team"); }, [router]);
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-10 pt-40 pb-24 text-center">
      <p className="eyebrow mb-4">Board of directors & management</p>
      <p className="font-display text-3xl font-light">Taking you to the <Link href="/team" className="text-gold link-underline">leadership page</Link>…</p>
    </section>
  );
}
