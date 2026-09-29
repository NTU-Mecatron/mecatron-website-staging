import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ntu-mecatron.github.io/mecatron-website-staging',
  base: '/mecatron-website-staging',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'directory'
  }
});