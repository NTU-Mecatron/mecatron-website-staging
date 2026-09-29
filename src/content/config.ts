import { defineCollection, z } from 'astro:content';

const logs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Field log', 'Build note', 'Team note']),
    readTime: z.string(),
    featured: z.boolean().default(false)
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: z.object({
      title: z.string(),
      accent: z.string(),
      description: z.string(),
      action: z.string(),
      actionHref: z.string(),
      signal: z.string()
    }),
    work: z.object({
      heading: z.string(),
      label: z.string(),
      name: z.string(),
      description: z.string(),
      visualLabel: z.string(),
      visualDetail: z.string(),
      facts: z.array(z.object({ label: z.string(), value: z.string() }))
    }),
    competitions: z.object({
      heading: z.string(),
      label: z.string(),
      title: z.string(),
      description: z.string(),
      facts: z.array(z.object({ label: z.string(), value: z.string() }))
    }),
    outreach: z.object({
      heading: z.string(),
      label: z.string(),
      description: z.string(),
      action: z.string(),
      actionHref: z.string()
    }),
    sponsors: z.object({
      heading: z.string(),
      label: z.string(),
      description: z.string(),
      action: z.string(),
      actionHref: z.string()
    }),
    contact: z.object({
      heading: z.string(),
      description: z.string(),
      action: z.string(),
      email: z.string()
    }),
    logs: z.object({
      heading: z.string(),
      action: z.string(),
      actionHref: z.string()
    }),
    team: z.object({
      heading: z.string(),
      label: z.string(),
      statement: z.string(),
      description: z.string(),
      emphasis: z.string()
    }),
    footer: z.object({ copyright: z.string(), note: z.string() })
  })
});

const sitePages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    backLabel: z.string(),
    articleBackLabel: z.string()
  })
});

const sections = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    label: z.string()
  })
});

const vehicles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    label: z.string(),
    gallery: z.array(z.string()).default([]),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([])
  })
});

export const collections = { logs, pages, sitePages, sections, vehicles };
