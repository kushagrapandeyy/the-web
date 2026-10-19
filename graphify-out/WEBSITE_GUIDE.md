# Website guide

Reviewed on October 16, 2026 at commit `0c76cdf6`.

## Start here

- `graph.html`: interactive Graphify code graph.
- `graph.json`: queryable graph data (278 nodes, 360 edges).
- `GRAPH_REPORT.md`: generated architecture report (28 communities).
- `wiki/index.md`: generated navigation index.

Graphify 0.9.92 extracted code locally with tree-sitter; no model API was used.
The graph covers code/configuration and extracted Markdown/MDX structure. It excludes environment files, lockfiles,
and generated output. MDX meaning, CSS, images, fonts, and unsupported files are
not semantically modeled by this structural graph. This guide supplements the graph with
source inspection; graph edges alone do not establish runtime behavior.

## Site and routes

This repository is Kushagra Pandey's personal engineering and design portfolio.
It presents a New York-based full-stack engineer, ASU Computer Science degree
and Film & Media Production minor, founder experience, and engineering/design work.

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Scramble-name hero, typewriter roles, particle field, bio/photo, skills, career/impact sections, contact links, Chronos canvas game |
| `/projects` | `app/projects/page.tsx` | Engineering-first project listing with a design tab |
| `/design` | `app/design/page.tsx` | Same listing component, initially on the design tab |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | MDX case study, header, details sidebar, view reporting |
| `/resume` | `app/resume/page.tsx` | Experience, projects, skills, education, courses, certifications; skill filtering and a separate print layout |
| `/contact` | `app/contact/page.tsx` | Animated email, LinkedIn, and GitHub cards |
| `/api/incr` | `pages/api/incr.ts` | Edge POST endpoint updating project view counts |

## Rendering and content

- Next.js 14.2.33 App Router, React 18, TypeScript with strict checking.
- `app/layout.tsx` imports global CSS, configures Inter and local CalSans,
  defines global metadata/social cards, and conditionally enables Beam Analytics.
- Contentlayer compiles `content/projects/*.mdx` into `allProjects`.
  `contentlayer.config.js` defines metadata fields, case-preserving slugs,
  GitHub-flavored Markdown, syntax highlighting, and heading anchors.
- There are 13 project documents: 12 published, one unpublished railway project.
  Four are categorized as design; published engineering/other entries total eight.
- Featured engineering entries are Firmlytic Solutions, Lyra (`Capstone`),
  and the portfolio itself. Other entries cover Grocery Price Tracker,
  Sales Analytics, Online Bookstore, SS Pandey & Associates, and MSK Fragrance.
- Design entries cover Tempe Camera, a ride-share pitch, WordFinder, and checkout UX.
  Their case studies embed external Figma prototypes/designs.
- `ProjectsContent` owns the listing UI and tab state.
  Detail pages use `Mdx`, `Header`, `ProjectSidebar`, and `ProjectScrollReveal`.
- `app/components/mdx.tsx` supplies styled HTML components and an image lightbox.
  The root `mdx-components.tsx` is a separate MDX component mapping.
- Project routes request 60-second revalidation. MDX changes still require a build
  because the source content is compiled into generated modules.

## Visual language and interaction

Black/zinc surfaces, teal/cyan/emerald accents, fine grids/noise, glow effects,
monospaced labels, and extensive Framer Motion animation. Styling is split
between Tailwind classes, inline styles, `global.css`, Tailwind configuration,
and the project MDX stylesheet. Repeated reveal/card patterns also live inside pages.

`Navigation` provides scroll progress and a translucent header; project details
use their own header. `Particles` uses `useMousePosition` for a canvas star field.
The homepage's Chronos game uses mouse-controlled movement, obstacles and score
collectibles, a 15-second pause, restart/continue controls, and localStorage high scores.
The résumé uses `window.print()` for PDF export through the browser print dialog.

## Services and deployment

- Upstash Redis provides `pageviews:projects:<slug>` counts.
  `ReportView` posts on mount; `/api/incr` hashes the forwarded IP and uses
  a 24-hour Redis key to deduplicate visits per project.
- Listing routes catch Redis read errors and display zero counts.
  The detail route's Redis read has no equivalent fallback.
- Redis uses environment configuration; Beam uses `NEXT_PUBLIC_BEAM_TOKEN`.
  Environment file contents were not read or indexed during this review.
- README documents Vercel deployment. No live deployment/account settings were checked.
- Commands: `dev`, `build`, `start`, and a modifying Rome `fmt` command.
  Both npm and pnpm lockfiles are committed. No test script is defined.

## Source findings to revisit

These are observations, not changes made during mapping:

1. `.env` is tracked; `.gitignore` excludes `.env*.local` but not `.env`.
   If it contains credentials, those need rotation and removal from tracking/history
   as appropriate. Its values were not inspected.
2. The MSK bottom-pinning code searches for `onlineBrand`, while the source filename
   is `OnlineBrand.mdx`; computed slugs preserve case, so that lookup does not match.
3. Published Sales Analytics references `/ProjectPngs/chocolate-sales-explorer.png`,
   which is absent. The unpublished railway document also references an absent image.
4. Detail lookup does not filter `published`, even though static params and listings do.
   The flag alone therefore does not enforce access control for draft routes.
5. `Particles` starts a recurring animation frame without canceling it on unmount.
6. Homepage/resume copy mixes graduated wording with May 2026 recruiting/graduation
   language. Those dates are now in the past.
7. Project/design route preparation is duplicated, and a few older components/imports
   remain alongside their replacements. No cleanup was performed.

## Refresh and query

Graphify 0.9.92 is installed user-wide, available on PATH, and registered as a
global Codex skill. It is not an application dependency. Run from any repository
root (use extraction for a new graph, update for an existing one):

```sh
graphify extract . --code-only --no-cluster
graphify cluster-only . --no-label
graphify update .
graphify export wiki
graphify query "How are project pages rendered?"
```

The CLI distribution is named `graphifyy`; the executable is `graphify`.
No Git hooks or background watchers were installed.
Graph/report/wiki generation and a graph query succeeded;
the application build, live UI, Redis connection, and external embeds remain untested.
