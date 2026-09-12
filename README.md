# Mecatron site

Mecatron is a Singapore-based marine robotics team. The public contact address is `contact@mecatron.sg`.

An Astro + MDX starter for a marine robotics team website. It builds to static HTML/CSS and can deploy to GitHub Pages.

For the complete route map, content model, YAML schemas, editing workflow, deployment notes, and AI documentation-review protocol, read [`docs/SITE_GUIDE.md`](docs/SITE_GUIDE.md).

**Documentation status:** last reviewed 2026-09-12; review every 30 days.

## Local development

```bash
npm install
npm run dev
```

## Add a field log

Create an `.md` or `.mdx` file in `src/content/logs/` with this frontmatter:

```md
---
title: "A clear title"
description: "One sentence that makes the story worth opening."
date: 2025-06-01
category: "Field log"
readTime: "5 min read"
featured: false
---
```

The generated routes are `/`, `/team`, `/vehicles`, `/competitions`, `/logs`, `/outreach`, `/sponsors`, and `/contact`.

## Update site content

The homepage copy is in `src/content/pages/home.md`. Keep its frontmatter and Markdown body as the source of truth for the landing page.

Team identity, navigation, contact details, and regularly changing member data live in `data/team.yaml`. The Astro renderer parses that YAML at build time; no page copy needs to be edited in `.astro` files.

The log index labels and descriptions live in `src/content/sitePages/logs.md`. Astro files contain only layout structure, data binding, and class names; visible copy is not authored in HTML markup.

The standalone public pages live in `src/content/sections/*.mdx` and are rendered at their matching routes. Add or edit a section there rather than adding copy to an Astro page.

## Update robotics data

The modular vehicle, competition, team, and member directories are maintained as separate files in `data/`.

- Add or rename vehicles in `data/vehicles.yaml`.
- Add competition appearances in `data/competitions.yaml`.
- Update team structure and approximate current team sizes in `data/teams.yaml`.
- Add or update stable member profiles in `data/members.csv`.
- Assign members to divisions and roles for each year in `data/members-by-year.yaml`.

The `/vehicles`, `/competitions`, and `/team` pages render these YAML records automatically.

Member profiles are stored once in CSV. Yearly division membership and roles are stored separately in YAML, allowing the same person to appear in multiple divisions and to move between divisions each year. The `/team` page defaults to the latest configured year and uses accessible year tabs to switch between configured years.

Division metrics are calculated from the selected year’s assignments. Each assignment supports `id`, `role`, and `type`. Use `lead`, `colead`, `advisor`, or `member`; if `type` is omitted it defaults to `member`. To change totals, add/remove an assignment or change its `type` in `members-by-year.yaml`; do not add manual count fields to `teams.yaml`.

## GitHub Pages

Set `site` in `astro.config.mjs` to the final Pages URL, then build with `npm run build`. The generated `dist/` folder is ready for a Pages deployment action or a branch-based Pages setup.
