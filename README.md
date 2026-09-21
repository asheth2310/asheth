# Aagam Sheth — Portfolio

Terminal-edition personal portfolio for **Aagam Sheth**, Software & AI Systems Engineer.
Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Framer Motion.
Deployed on Vercel at [asheth.vercel.app](https://asheth.vercel.app).

## Sections

Sticky navbar → Hero (live agent terminal) → Proof strip → Systems (case studies
with live GitHub stars) → Playground (streaming AI agent chat) → Experience →
Principles → Stack matrix → Contact (working form) → Footer.

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | for contact form | Resend API key used by `/api/contact` |
| `CONTACT_TO_EMAIL` | for contact form | Inbox that receives contact submissions |
| `CONTACT_FROM_EMAIL` | optional | Verified sender (defaults to Resend onboarding address) |
| `GITHUB_TOKEN` | optional | Raises GitHub API quota for `/api/github` (60 → 5,000 req/hr) |
| `OPENAI_API_KEY` | for agent chat | Powers the playground agent via `/api/chat` |

Without the contact variables, `/api/contact` returns an honest configuration
error instead of a fake success. Without `OPENAI_API_KEY`, the playground chat
falls back to a local keyword-based knowledge base.

## Personal details

Central config lives in `src/lib/site.ts` (name, email, LinkedIn, resume path).
All section content lives in `src/lib/content.ts` — every claim there is
traceable to a real repo, README, or role. Don't invent metrics.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Notes

- The site is dark-first and honors `prefers-reduced-motion`.
- SEO: metadata, OpenGraph/Twitter cards, `robots.ts`, `sitemap.ts`, and
  Person JSON-LD are configured in `src/app/layout.tsx`.
