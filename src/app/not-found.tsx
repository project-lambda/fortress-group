import Link from "next/link";
export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center text-center px-5">
      <p className="eyebrow mb-6">404</p>
      <h1 className="font-display text-6xl md:text-8xl font-light">Lost in <em className="text-gold">Dhaka?</em></h1>
      <Link href="/" className="mt-10 rounded-full border border-gold/60 px-8 py-3 text-xs tracking-[0.3em] uppercase text-gold hover:bg-gold hover:text-ink transition-all">Back home</Link>
    </section>
  );
}
