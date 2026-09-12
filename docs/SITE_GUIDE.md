# Mecatron website maintenance guide

**Last updated:** 2026-09-12  
**Documentation review interval:** 30 days  
**Next review due:** 2026-10-12

This guide is the source of truth for how the Mecatron website is structured and how a human or AI should safely edit it.

## 1. What this project is

This is a static Astro website for Mecatron, a Singapore-based marine robotics team. It is deployed as generated HTML, CSS, JavaScript, and assets, so it does not require a server or database at runtime.

The project uses:

- Astro for page layouts and static route generation
- Markdown and MDX for page and article content
- YAML and CSV for regularly changing team, vehicle, competition, and member data
- TypeScript loaders for parsing and typing YAML
- CSS in `src/styles/global.css` for the visual system

The important content rule is: **do not author visitor-facing copy directly in `.astro` markup**. Put copy in Markdown/MDX or YAML. Astro files should contain rendering structure, data bindings, semantic HTML, and CSS class names.

Do not add HTML form tags or form controls for content entry. This is a static content site: author page content in Markdown/MDX, store regularly changing structured data in YAML or CSV, and use ordinary links for contact and external actions.

## 2. Site map

### Homepage

`src/pages/index.astro` renders `/`.

The homepage intentionally contains the complete scrolling story and anchor sections:

- `#vehicles`
- `#competitions`
- `#logs`
- `#team`
- `#outreach`
- `#sponsors`
- `#contact`

The homepage also links to the corresponding dedicated pages. Keep both experiences: visitors can browse the whole story on `/`, or open a focused page.

### Dedicated section pages

The following MDX files generate pages through the shared dynamic route `src/pages/[slug].astro`:

| Content file | Route |
| --- | --- |
| `src/content/sections/team.mdx` | `/team` |
| `src/content/sections/vehicles.mdx` | `/vehicles` |
| `src/content/sections/competitions.mdx` | `/competitions` |
| `src/content/sections/outreach.mdx` | `/outreach` |
| `src/content/sections/sponsors.mdx` | `/sponsors` |
| `src/content/sections/contact.mdx` | `/contact` |

The dynamic route renders the MDX article first, then adds structured catalogs for vehicles, competitions, and team members based on YAML data.

### Blog / field logs

- `src/pages/logs/index.astro` renders `/logs`
- `src/pages/logs/[slug].astro` renders each article
- `src/content/logs/*.mdx` contains the articles
- `src/content/sitePages/logs.md` contains the log index labels and descriptions

## 3. Where to edit content

### Site identity and navigation

Edit `data/team.yaml` for:

- Organisation name
- Location
- Contact email
- Header navigation labels and URLs
- Copyright text
- General member metadata kept with the site identity

The typed parser is `data/team.ts`. Update its interface if the YAML shape changes.

### Homepage content

Edit `src/content/pages/home.md`. Its frontmatter contains the homepage sections used by `src/pages/index.astro`:

- `hero`
- `work`
- `competitions`
- `logs`
- `team`
- `outreach`
- `sponsors`
- `contact`
- `footer`

If a frontmatter field is renamed or removed, update the matching schema in `src/content/config.ts` and the Astro bindings.

### Root data directory

Edit the relevant file under `data/`:

- `vehicles.yaml` — vehicle slug, name, year, description, tags, and status
- `competitions.yaml` — competition name, series, and year
- `teams.yaml` — division name and slug
- `members.csv` — stable member identity/profile data: ID, name, degree, detail, image paths, and profile URL
- `members-by-year.yaml` — yearly division membership and role assignments

`data/robotics.ts` parses these files and exports the combined `robotics` object used by `src/pages/[slug].astro`.
`data/team.ts` parses `data/team.yaml` and exports the typed site identity and navigation object.

Keep the root `data/` directory separate from `src/`: it is the canonical editing location for operational site data. Do not recreate a `src/data/robotics/` directory or duplicate records in Astro components. When adding a field, update the corresponding TypeScript interface and all consumers together.

### Member profiles and images

Each member in `members.csv` should have:

```csv
id,name,degree,detail,image,hoverImage,profileUrl
member-id,Full name,Degree and graduation year,Short introduction,/images/team/name-default.jpg,/images/team/name-hover.jpg,https://www.linkedin.com/in/profile
```

Place real images in `public/images/team/`. URLs beginning with `/` resolve from the public site root. The default image is visible normally; the hover image appears on hover and keyboard focus. The profile card opens `profileUrl` in a new tab.

The CSV is the canonical profile record; each person should appear once. Yearly YAML assigns that profile ID to one or more divisions and supplies the role for that year. The same ID may occur in multiple divisions in the same year:

```yaml
latestYear: 2026
years:
  2026:
    divisions:
      - slug: mechanical
        members:
          - id: member-id
            role: "Mechanical lead"
            type: lead
```

Allowed values for `type` are `lead`, `colead`, `advisor`, and `member`. If `type` is omitted, the renderer treats the assignment as `member`. The team page defaults to `latestYear`, and its accessible year tabs switch between configured years. Lead, co-lead, advisor, and member metrics are counted directly from the selected year’s `type` fields, so update the assignment type in `members-by-year.yaml` rather than maintaining separate count fields. The current SVGs at `public/images/team/default.svg` and `public/images/team/hover.svg` are safe placeholders, not final portraits. Update the CSV once for a person, then update yearly assignments when their division or role changes.

### Vehicles

Each vehicle record in `data/vehicles.yaml` renders as a fleet card on `/vehicles` and gets a detail route at `/vehicles/<slug>`. The card includes its year, description, tags, status, “Meet X” CTA, and a client-side Three.js schematic.

Each detail page is authored in `src/content/vehicles/<slug>.md`. Its frontmatter supports `gallery` image paths and `specs`; its Markdown body contains the vehicle story. Put additional images in `public/images/vehicles/`. `src/components/VehicleRender.astro` provides the procedural animated render; replace or extend it when real 3D models or vehicle-specific animation data are available.

### Styling and interaction

Edit `src/styles/global.css` for layout, responsive behavior, typography, colors, buttons, cards, and states. Keep visual tokens in `:root` and reuse existing classes before creating new ones.

Interactive behavior belongs in the component that owns the structure:

- `src/pages/[slug].astro` owns team year-tab behavior and catalog rendering.
- `src/components/VehicleRender.astro` owns client-side Three.js vehicle renders.
- Member cards use links for external profiles; preserve keyboard focus, new-tab behavior, and `rel="noreferrer"`.
- Do not replace content links with form submissions or client-side data-entry widgets.

The main design tokens are:

- Deep ink: `#07151b`
- Soft ink: `#10272e`
- Paper: `#e8eee8`
- Dim paper: `#aabbb4`
- Signal orange: `#ff6b3d`
- Soft signal orange: `#ff9671`
- Sea foam: `#c5efe5`
- Body/display font: IBM Plex Sans
- Metadata font: DM Mono

## 4. Schemas and rendering boundaries

`src/content/config.ts` validates frontmatter for content collections:

- `logs`
- `pages`
- `sitePages`
- `sections`

If content validation fails, do not bypass it with loose casts. Update the schema and the corresponding data deliberately.

Rendering responsibilities:

- `BaseLayout.astro`: document shell, metadata, title, favicon
- `Header.astro`: identity, navigation, contact link
- `SignalMark.astro`: reusable visual marker
- `index.astro`: complete homepage composition and anchors
- `[slug].astro`: shared dedicated section-page composition
- `logs/index.astro`: log index
- `logs/[slug].astro`: individual log articles
- `vehicles/[slug].astro`: individual vehicle routes, metadata, gallery, specs, and MDX body
- `VehicleRender.astro`: procedural client-side vehicle visualization

## 5. Common editing tasks

### Add a field log

1. Create `src/content/logs/short-slug.mdx`.
2. Add the required frontmatter:

   ```yaml
   ---
   title: "A clear title"
   description: "A one-sentence summary."
   date: 2026-09-12
   category: "Field log"
   readTime: "5 min read"
   featured: false
   ---
   ```

3. Write the article below the frontmatter.
4. Run `npm run check` and `npm run build`.

### Add a vehicle or competition

Add one YAML record to the appropriate file under `data/`. The dedicated page will render it automatically.

For a vehicle detail page, use a matching slug in both `data/vehicles.yaml` and `src/content/vehicles/<slug>.md`. Add gallery assets under `public/images/vehicles/`; do not embed large binary assets in Markdown or YAML.

### Add a new dedicated section page

1. Add `src/content/sections/example.mdx` with `title`, `description`, and `label` frontmatter.
2. Add a navigation entry to `data/team.yaml`.
3. Add the URL to the homepage directory or relevant homepage section if it should be discoverable there.
4. Add special structured rendering to `src/pages/[slug].astro` only if the page needs data beyond its MDX body.
5. Run validation and confirm the generated route.

## 6. Local development and deployment

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run type/content validation:

```bash
npm run check
```

Generate static output:

```bash
npm run build
```

The generated site is written to `dist/`. Set the final GitHub Pages URL in `astro.config.mjs` before deployment.

## 7. AI maintenance protocol

An AI editing this repository must check the documentation date before making broad changes.

1. Read the `Last updated` and `Next review due` values at the top of this file.
2. If today is on or after the next review due date, inspect the route list, content directories, YAML schemas, scripts, and deployment configuration for drift.
3. Update this guide’s `Last updated` date and set `Next review due` to 30 days later.
4. Update `README.md`, `PRODUCT.md`, and `DESIGN.md` when their summaries no longer match the implementation.
5. Do not update the date merely for an unrelated one-line content edit unless the documentation itself was reviewed.

The AI should perform this documentation review at least every 30 days, after any architecture change, and whenever a new content type, route, data file, deployment method, or visual system token is introduced. The review must verify that examples, route lists, data paths, year-selection behavior, and validation commands still match the repository.

## 8. Completion checklist

Before handing off a change:

- Content is in Markdown/MDX/YAML rather than hardcoded visitor-facing text in Astro.
- New routes are linked from the appropriate navigation or page.
- YAML changes match the TypeScript interfaces.
- The root `data/` directory remains the only source for regularly changing robotics records.
- New images are inside `public/` and use root-relative URLs.
- No visitor-facing content or data-entry form has been added to an Astro template.
- External profile links use a new tab and `rel="noreferrer"`.
- `npm run check` passes with zero errors.
- `npm run build` passes and generates the expected route.
- This guide is updated if the architecture or editing workflow changed.
