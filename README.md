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

## Lead forms (contact page + project booking)

Both forms POST to `/api/lead`, which validates the payload (honeypot + per-IP rate limit) and emails the lead via [Resend](https://resend.com). Copy `.env.example` to `.env.local` and set:

- `RESEND_API_KEY` — your Resend key
- `LEAD_TO_EMAIL` — where enquiries go (comma-separated for several inboxes)
- `LEAD_FROM_EMAIL` — optional verified sender on your domain

Without a key, leads are logged to the server console and the user still sees a success state. Every form also offers a one-click **Chat on WhatsApp** link with the enquiry pre-filled.

## Deployment

- **Live site:** https://emroze.dev/fortress-group (static export served by GitHub Pages from the `project-lambda/apps` repo, which checks this repo out and builds it with `GH_PAGES=1`).
- **Form API:** https://fortress-group-nine.vercel.app (Vercel, `vercel deploy --prod`). The static site posts leads here; `/api/lead` allows the `https://emroze.dev` origin. Set `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` in the Vercel project to deliver emails.
- **Publishing a change:** push to `main`, then run the apps repo's "Deploy to GitHub Pages" workflow (`gh workflow run deploy.yml --repo project-lambda/apps`). With a fine-grained PAT stored as the `APPS_DISPATCH_TOKEN` secret in this repo, that happens automatically on push.
