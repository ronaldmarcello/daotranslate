import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mronaldjs.github.io',
  base: '/daotranslate',
  integrations: [tailwind()],
  server: {
    port: 4321,
    host: true
  }
});

