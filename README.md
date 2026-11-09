# Fortress Group — website redesign

A modern, animated redesign of [fortressgroup.com.bd](https://fortressgroup.com.bd/), built with Next.js 16, Tailwind CSS v4, Motion and Lenis smooth scrolling.

All content (35 projects, leadership bios, sales team, awards, sister concerns, contact details and imagery) was scraped from the live site and lives in `src/data/site.json`; images are in `public/images`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/app` — routes: home, `/projects` (filterable), `/projects/[slug]`, `/about`, `/team`, `/team/[slug]`, `/news`, `/contact`
- `src/components` — hero, horizontal scroll showcase, reveal animations, navbar with fullscreen menu, etc.
- `src/lib/data.ts` — typed accessors over `site.json`
