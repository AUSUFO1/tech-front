# GizPulse

GizPulse is a modern tech media platform for ambitious readers in Nigeria and beyond. It combines news, jobs, opportunities, guides, and newsletter growth in a single editorial product.

Core brand line:

`Stay Ahead. Stay Informed. Earn with Tech.`

## Vision

Build a trusted, high-authority platform where readers return daily for:

- tech and business news
- remote and Nigeria-focused jobs
- scholarships, fellowships, and growth opportunities
- beginner-friendly guides
- practical ways to earn with tech

## Current Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Sanity CMS
- Resend
- Cloudflare Turnstile
- Vercel

## Design System

Typography:

- Headlines: `Sora`
- Body: `Inter`
- Reading serif: `Source Serif 4`
- Technical mono: `JetBrains Mono`

Color tokens:

- Background: `#F8FAFC`
- Card Background: `#FFFFFF`
- Primary Text: `#0F172A`
- Muted Text: `#64748B`
- Primary Green: `#16A34A`
- Gold Accent: `#F59E0B`
- Border: `#E2E8F0`

Dark mode tokens are defined in [`src/styles/globals.css`](C:/Users/USER/gizpulse/src/styles/globals.css).

## Current Product Areas

- Homepage
- News
- Blog
- Jobs
- Opportunities
- Earn
- Authors
- Newsletter landing page
- Search page
- Sanity Studio
- Privacy / Terms / Accessibility / About

## What Is Already Working

Foundation:

- global layout and typography
- dark/light mode
- responsive header and footer
- homepage sections and category paths

Newsletter:

- dedicated `/newsletter` landing page
- newsletter signup API route
- Resend welcome email sending
- Sanity subscriber storage
- Turnstile protection
- homepage newsletter signup wired
- inline article newsletter signup wired

Comments:

- comment API route
- comment persistence in Sanity
- moderation flow through Sanity Studio
- IP hashing
- in-memory rate limiting
- Turnstile protection
- calmer production-style validation and error messages

CMS:

- Sanity Studio integrated
- content schemas for authors, blog, news, jobs, opportunities, comments, newsletter subscribers

## Current Source of Truth

Right now the app is mixed:

- interaction systems are real: newsletter, comments, Sanity Studio
- a large part of content rendering is still driven by mock data in [`src/lib/mock-content.ts`](C:/Users/USER/gizpulse/src/lib/mock-content.ts) and [`src/lib/mock-authors.ts`](C:/Users/USER/gizpulse/src/lib/mock-authors.ts)

This is acceptable during build-out, but before public launch the important public pages should read from Sanity instead of mock content.

## Launch Direction

Short version:

1. deploy to Vercel first
2. test on the Vercel domain
3. switch key pages from mock content to Sanity
4. fill real content in CMS
5. connect the custom domain next week
6. only after domain connection, finalize Google-facing SEO work and submit to Search Console / Google News later

## Recommended Content Strategy Before Public Push

Before the custom domain goes live, the goal is to avoid obvious placeholder content on public pages.

Target:

- 20 to 25 solid articles before the public launch window next week
- enough real content to cover the main sections
- especially stronger population of the `news` section

Recommended minimum launch mix:

- 8 to 10 news posts
- 4 to 5 blog/guides posts
- 3 to 4 jobs
- 3 to 4 opportunities
- 2 to 3 earn-with-tech posts

## What Was Cleaned Up

The following dead placeholder files were removed because they were unused and returned `null`:

- `src/components/CategoryFilter.tsx`
- `src/components/JobCard.tsx`
- `src/components/NewsCard.tsx`
- `src/components/NewsletterSignup.tsx`
- `emails/WeeklyDigest.tsx`
- `emails/WelcomeEmail.tsx`

## What Still Needs To Be Done

Highest priority:

- switch homepage content from mock data to Sanity
- switch listing pages from mock data to Sanity
- switch detail pages from mock data to Sanity
- add real rich content rendering from CMS
- create enough real content in Sanity

Pre-launch technical:

- Vercel deployment
- verify all environment variables in Vercel
- production test newsletter flow
- production test comment flow
- production test Sanity Studio access
- mobile QA pass across main pages

SEO and indexing:

- dynamic metadata from Sanity
- sitemap.xml
- news-sitemap.xml
- canonical URLs
- OG image strategy
- robots configuration

Launch hardening:

- replace remaining placeholder copy where needed
- confirm no mock content is visibly shipping on critical pages
- check empty states and error states
- final pass on navigation and footer links

## Environment Variables

Current required variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_TOKEN=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
```

## Immediate Execution Plan

### Phase 1: Sunday Vercel Readiness

- ensure Vercel deployment succeeds
- set all production env vars
- test newsletter signup on deployed URL
- test comments on deployed URL
- sanity-check mobile layout on homepage, article page, newsletter page, jobs/opportunities page

### Phase 2: CMS Migration

- homepage to Sanity
- news list and news detail to Sanity
- blog list and blog detail to Sanity
- jobs and opportunities pages to Sanity
- authors to Sanity

### Phase 3: Search and SEO

- metadata from Sanity
- sitemap
- news sitemap
- Search Console preparation

### Phase 4: Domain Go-Live

- buy domain next week
- connect domain to Vercel
- optionally front it with Cloudflare
- verify SSL
- re-test forms and Studio

## Notes

- Vercel is fine as the first public test URL.
- The custom domain should become the long-term canonical domain.
- Mock content can remain in the repository for now, but it should stop powering the important public pages before full launch.
