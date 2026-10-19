# Graph Report - Kp.com  (2026-10-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 278 nodes · 360 edges · 28 communities (19 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26473ad9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- projects/page.tsx
- app/page.tsx
- compilerOptions
- dependencies
- [slug]/page.tsx
- devDependencies
- resume/page.tsx
- app/layout.tsx
- next
- overrides
- photoQuizGame.mdx
- mdx.d.ts
- startupPitch.mdx
- tempeCameraRedesign.mdx
- checkoutRedesign.mdx
- firmlyticSolutions.mdx
- Capstone.mdx
- priceTracker.mdx
- railwayTicketing.mdx
- sspandey.mdx
- bookstore.mdx
- salesExplorer.mdx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `react` - 17 edges
3. `next` - 13 edges
4. `Navigation()` - 11 edges
5. `framer-motion` - 10 edges
6. `ProjectsContent()` - 9 edges
7. `overrides` - 8 edges
8. `Home()` - 7 edges
9. `lucide-react` - 7 edges
10. `PostPage()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Particles()` --calls--> `useMousePosition()`  [EXTRACTED]
  app/components/particles.tsx → util/mouse.ts
- `DesignPage()` --calls--> `Navigation()`  [EXTRACTED]
  app/design/page.tsx → app/components/nav.tsx
- `ProjectsPage()` --calls--> `Navigation()`  [EXTRACTED]
  app/projects/page.tsx → app/components/nav.tsx
- `Home()` --calls--> `Navigation()`  [EXTRACTED]
  app/page.tsx → app/components/nav.tsx
- `DesignPage()` --calls--> `ProjectsContent()`  [EXTRACTED]
  app/design/page.tsx → app/projects/projects-content.tsx

## Import Cycles
- None detected.

## Communities (28 total, 9 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (35): computedFields, Page, Project, name, private, scripts, build, dev (+27 more)

### Community 1 - "projects/page.tsx"
Cohesion: 0.11
Nodes (21): Card(), DesignPage(), redis, revalidate, Article(), Props, ProjectsPage(), redis (+13 more)

### Community 2 - "app/page.tsx"
Cohesion: 0.13
Nodes (16): Particles(), ParticlesProps, CharCell, ChronosGame(), GameEntity, Home(), roles, ScrambleName() (+8 more)

### Community 3 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx (+13 more)

### Community 4 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, contentlayer, framer-motion, lucide-react, markdown-wasm, next, next-contentlayer, @next/font (+11 more)

### Community 5 - "[slug]/page.tsx"
Cohesion: 0.17
Nodes (11): Mdx(), Header(), Props, PostPage(), Props, redis, revalidate, ProjectScrollReveal() (+3 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, autoprefixer, @opentelemetry/api, postcss, postcss-nesting, rome, tailwindcss, tailwindcss-debug-screens (+5 more)

### Community 7 - "resume/page.tsx"
Cohesion: 0.17
Nodes (17): Navigation(), ContactCard(), contactLinks, ContactPage(), TiltCard(), academicProjects, certifications, ClipReveal() (+9 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.28
Nodes (6): Analytics(), calSans, inter, metadata, RootLayout(), @next/font

### Community 9 - "next"
Cohesion: 0.25
Nodes (6): clsx(), components, ImageLightbox(), MdxProps, nextConfig, next-contentlayer

### Community 10 - "overrides"
Cohesion: 0.22
Nodes (9): @opentelemetry/api, @opentelemetry/core, @opentelemetry/exporter-trace-otlp-grpc, @opentelemetry/resources, @opentelemetry/sdk-trace-base, @opentelemetry/sdk-trace-node, @opentelemetry/semantic-conventions, pnpm (+1 more)

### Community 12 - "photoQuizGame.mdx"
Cohesion: 0.22
Nodes (8): Design Focus, Game Board Layout, Interface States, Outcome, Overview, Role, Tools, Visual Restraint

### Community 16 - "startupPitch.mdx"
Cohesion: 0.25
Nodes (7): App Wireframes, Outcome, Overview, Pitch Deck, Role, Tools, What Was Designed

### Community 17 - "tempeCameraRedesign.mdx"
Cohesion: 0.25
Nodes (7): Key Design Decisions, Outcome, Overview, Problem, Process, Role, Tools

### Community 18 - "checkoutRedesign.mdx"
Cohesion: 0.29
Nodes (6): Key Design Changes, Outcome, Overview, Problem, Role, Tools

### Community 19 - "firmlyticSolutions.mdx"
Cohesion: 0.40
Nodes (4): Current Status, Key Outcomes, Solution & Infrastructure, The Problem

### Community 20 - "Capstone.mdx"
Cohesion: 0.40
Nodes (4): Architecture & Deployment, ASU Capstone Showcase, Database Design, Weighted Matchmaking Engine

### Community 21 - "priceTracker.mdx"
Cohesion: 0.50
Nodes (3): Database & Performance Optimization, Real-Time Price Intelligence at Scale, Scraping & Alerting Infrastructure

### Community 22 - "railwayTicketing.mdx"
Cohesion: 0.50
Nodes (3): Key Learnings, Technical Architecture, What It Does

## Knowledge Gaps
- **17 isolated node(s):** `autoprefixer`, `markdown-wasm`, `@next/mdx`, `@opentelemetry/api`, `postcss` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 184 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `projects/page.tsx` to `package.json`, `app/page.tsx`, `[slug]/page.tsx`, `resume/page.tsx`, `app/layout.tsx`, `next`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `autoprefixer`, `markdown-wasm`, `@next/mdx` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05094130675526024 - nodes in this community are weakly interconnected._
- **Why does `react` connect `app/page.tsx` to `package.json`, `projects/page.tsx`, `[slug]/page.tsx`, `resume/page.tsx`, `next`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `projects/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11330049261083744 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._