import { defineConfig } from 'vitepress';
import { buildSidebar } from './sidebar.js';

// Served from https://openlyceum.github.io/Almanach/ (project pages).
// Override with VITEPRESS_BASE=/ for local dev (see package.json "dev" script).
export const BASE = process.env.VITEPRESS_BASE ?? '/Almanach/';

export default defineConfig( {
  title: 'Almanach',
  description: 'A SceneryStack knowledge base: API guides, software patterns, and conventions, readable by humans and LLM agents alike.',
  base: BASE,
  cleanUrls: true,
  lastUpdated: true,

  vite: {
    ssr: {
      // Keep SceneryStack out of the SSR bundle — demos load it client-side
      // only. Listing the package name also externalizes its subpath imports
      // (e.g. scenerystack/scenery), which Vite matches by package name.
      external: [ 'scenerystack' ]
    },
    optimizeDeps: {
      include: [
        'scenerystack/scenery',
        'scenerystack/sun',
        'scenerystack/scenery-phet',
        'scenerystack/axon',
        'scenerystack/dot',
        'scenerystack/tandem'
      ]
    }
  },

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/what-is-scenerystack' },
      { text: 'Guides', link: '/guides/scenery-basics' },
      { text: 'Examples', link: '/examples/demo-simulation-walkthrough' }
    ],

    sidebar: buildSidebar(),

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OpenLyceum/Almanach' }
    ],

    outline: 'deep',

    footer: {
      message: 'Machine-readable indexes: <a href="/Almanach/llms.txt">llms.txt</a> · <a href="/Almanach/llms-full.txt">llms-full.txt</a> · <a href="/Almanach/manifest.json">manifest.json</a>'
    }
  }
} );
