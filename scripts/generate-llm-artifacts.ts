/**
 * Scans every documentation page under docs/, validates its frontmatter against the
 * schema documented in docs/meta/authoring-guide.md, and emits three
 * machine-readable artifacts into docs/public/ (served at the site root):
 *
 *   llms.txt       - llms.txt-convention index: one link + description per page
 *   llms-full.txt  - all pages concatenated, for one-shot ingestion
 *   manifest.json  - structured metadata for every page
 *
 * Exits non-zero with per-file error messages when validation fails, so this
 * doubles as the lint step in CI (run via `npm run generate`).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
const DOCS_DIR = path.join( ROOT, 'docs' );
const OUT_DIR = path.join( DOCS_DIR, 'public' );
const SITE_URL = 'https://openlyceum.github.io/Almanach';
const SITE_TITLE = 'Almanach — SceneryStack Knowledge Base';
const SITE_SUMMARY = 'A file-based knowledge base of SceneryStack knowledge: API guides, software patterns, styling, and accessibility conventions for building interactive simulations. Every page is plain Markdown with structured frontmatter.';

// Category order and labels, mirrored in docs/.vitepress/sidebar.ts
const CATEGORIES: Record<string, string> = {
  'getting-started': 'Getting Started',
  'guides': 'Guides',
  'api': 'API',
  'patterns': 'Patterns',
  'styling': 'Styling',
  'accessibility': 'Accessibility',
  'examples': 'Examples',
  'cookbook': 'Cookbook',
  'meta': 'Meta'
};

const EXCLUDED_DIRS = new Set( [ '.vitepress', 'public', 'node_modules' ] );
const VALID_STATUSES = new Set( [ 'stub', 'draft', 'complete', 'verified' ] );

type PageRecord = {
  path: string;        // site-absolute route, e.g. /api/phetcommon/model-view-transform
  sourceFile: string;  // repo-relative source, e.g. docs/api/phetcommon/model-view-transform.md
  title: string;
  description: string;
  category: string;
  library?: string;    // required when category === 'api'; the scenerystack/* subpath, e.g. "phetcommon"
  tags: string[];
  status: string;
  related: string[];
  prerequisites: string[];
  sourceRefs: string[];
  navOrder?: number;    // optional — curated sidebar position within a section (see docs/meta/authoring-guide.md)
  wordCount: number;
  content: string;
};

function walkMarkdownFiles( dir: string ): string[] {
  const results: string[] = [];
  for ( const entry of fs.readdirSync( dir, { withFileTypes: true } ) ) {
    const fullPath = path.join( dir, entry.name );
    if ( entry.isDirectory() ) {
      if ( !EXCLUDED_DIRS.has( entry.name ) ) {
        results.push( ...walkMarkdownFiles( fullPath ) );
      }
    }
    else if ( entry.name.endsWith( '.md' ) ) {
      results.push( fullPath );
    }
  }
  return results;
}

const errors: string[] = [];
const pages: PageRecord[] = [];

for ( const file of walkMarkdownFiles( DOCS_DIR ) ) {
  const relative = path.relative( DOCS_DIR, file );

  // The home page is a VitePress landing page, not a schema-validated documentation article.
  if ( relative === 'index.md' ) {
    continue;
  }

  const { data, content } = matter( fs.readFileSync( file, 'utf-8' ) );
  const fileErrors: string[] = [];
  const segments = relative.split( path.sep );
  const category = segments[ 0 ];

  if ( typeof data.title !== 'string' || data.title.trim() === '' ) {
    fileErrors.push( 'missing required frontmatter field "title"' );
  }
  if ( typeof data.description !== 'string' || data.description.trim() === '' ) {
    fileErrors.push( 'missing required frontmatter field "description"' );
  }
  if ( data.category !== category ) {
    fileErrors.push( `frontmatter "category" is ${JSON.stringify( data.category )} but must match the containing folder "${category}"` );
  }
  if ( category === 'api' ) {
    const library = segments[ 1 ];
    if ( segments.length < 3 ) {
      fileErrors.push( 'api/ pages must live in a library subfolder, e.g. api/axon/property.md' );
    }
    else if ( typeof data.library !== 'string' || data.library !== library ) {
      fileErrors.push( `frontmatter "library" is ${JSON.stringify( data.library )} but must match the containing subfolder "${library}"` );
    }
  }
  if ( !VALID_STATUSES.has( data.status ) ) {
    fileErrors.push( `frontmatter "status" is ${JSON.stringify( data.status )} but must be one of: ${[ ...VALID_STATUSES ].join( ', ' )}` );
  }
  if ( !Array.isArray( data.tags ) || data.tags.length === 0 || data.tags.some( ( tag: unknown ) => typeof tag !== 'string' ) ) {
    fileErrors.push( 'frontmatter "tags" must be a non-empty array of strings' );
  }
  if ( data.related !== undefined && ( !Array.isArray( data.related ) || data.related.some( ( r: unknown ) => typeof r !== 'string' ) ) ) {
    fileErrors.push( 'frontmatter "related" must be an array of site-absolute paths like /patterns/drag-listeners' );
  }
  if ( data.prerequisites !== undefined && ( !Array.isArray( data.prerequisites ) || data.prerequisites.some( ( r: unknown ) => typeof r !== 'string' ) ) ) {
    fileErrors.push( 'frontmatter "prerequisites" must be an array of site-absolute paths like /patterns/drag-listeners' );
  }
  if ( data.sourceRefs !== undefined && ( !Array.isArray( data.sourceRefs ) || data.sourceRefs.some( ( r: unknown ) => typeof r !== 'string' ) ) ) {
    fileErrors.push( 'frontmatter "sourceRefs" must be an array of URL strings' );
  }
  if ( data.navOrder !== undefined && ( typeof data.navOrder !== 'number' || !Number.isFinite( data.navOrder ) ) ) {
    fileErrors.push( 'frontmatter "navOrder" must be a finite number when present' );
  }

  if ( fileErrors.length > 0 ) {
    errors.push( ...fileErrors.map( message => `docs/${relative}: ${message}` ) );
    continue;
  }

  const route = '/' + relative.replace( /\\/g, '/' ).replace( /\.md$/, '' );
  pages.push( {
    path: route,
    sourceFile: `docs/${relative.replace( /\\/g, '/' )}`,
    title: data.title,
    description: data.description,
    category: category,
    library: data.library,
    tags: data.tags,
    status: data.status,
    related: data.related ?? [],
    prerequisites: data.prerequisites ?? [],
    sourceRefs: data.sourceRefs ?? [],
    navOrder: typeof data.navOrder === 'number' ? data.navOrder : undefined,
    wordCount: content.split( /\s+/ ).filter( word => word.length > 0 ).length,
    content: content.trim()
  } );
}

// Every "related"/"prerequisites" entry must point at an existing page, so cross-links never rot.
const routes = new Set( pages.map( page => page.path ) );
for ( const page of pages ) {
  for ( const related of page.related ) {
    if ( !routes.has( related ) ) {
      errors.push( `${page.sourceFile}: related entry "${related}" does not match any document` );
    }
  }
  for ( const prerequisite of page.prerequisites ) {
    if ( !routes.has( prerequisite ) ) {
      errors.push( `${page.sourceFile}: prerequisites entry "${prerequisite}" does not match any document` );
    }
  }
}

if ( errors.length > 0 ) {
  console.error( `Frontmatter validation failed (${errors.length} error${errors.length === 1 ? '' : 's'}):\n` );
  for ( const error of errors ) {
    console.error( `  - ${error}` );
  }
  process.exit( 1 );
}

// Stable ordering matches the visible sidebar: category order above, then
// library (for api/), then navOrder-then-title so curated sections read in
// their intended learning order while uncurated ones stay alphabetical.
const categoryOrder = Object.keys( CATEGORIES );
pages.sort( ( a, b ) => {
  const byCategory = categoryOrder.indexOf( a.category ) - categoryOrder.indexOf( b.category );
  if ( byCategory !== 0 ) { return byCategory; }
  const byLibrary = ( a.library ?? '' ).localeCompare( b.library ?? '' );
  if ( byLibrary !== 0 ) { return byLibrary; }
  const ao = typeof a.navOrder === 'number';
  const bo = typeof b.navOrder === 'number';
  if ( ao && bo ) { return a.navOrder! - b.navOrder! || a.title.localeCompare( b.title ); }
  if ( ao ) { return -1; }
  if ( bo ) { return 1; }
  return a.title.localeCompare( b.title );
} );

fs.mkdirSync( OUT_DIR, { recursive: true } );

// ---------- llms.txt ----------
let llms = `# ${SITE_TITLE}\n\n> ${SITE_SUMMARY}\n\nFull content of every page is available at ${SITE_URL}/llms-full.txt and structured metadata at ${SITE_URL}/manifest.json. Raw Markdown sources live at https://github.com/OpenLyceum/Almanach under docs/.\n`;
for ( const categoryKey of categoryOrder ) {
  const categoryPages = pages.filter( page => page.category === categoryKey );
  if ( categoryPages.length === 0 ) { continue; }
  llms += `\n## ${CATEGORIES[ categoryKey ]}\n\n`;
  let currentLibrary: string | undefined;
  for ( const page of categoryPages ) {
    if ( categoryKey === 'api' && page.library !== currentLibrary ) {
      currentLibrary = page.library;
      llms += `\n### ${currentLibrary}\n\n`;
    }
    llms += `- [${page.title}](${SITE_URL}${page.path}): ${page.description}\n`;
  }
}
fs.writeFileSync( path.join( OUT_DIR, 'llms.txt' ), llms );

// ---------- llms-full.txt ----------
let full = `# ${SITE_TITLE}\n\n> ${SITE_SUMMARY}\n\nThis file contains the full text of all ${pages.length} pages. Each page begins with a "===" separator line.\n`;
for ( const page of pages ) {
  full += `\n\n${'='.repeat( 72 )}\n`;
  full += `Page: ${page.title}\n`;
  full += `URL: ${SITE_URL}${page.path}\n`;
  full += `Source: ${page.sourceFile}\n`;
  full += `Category: ${CATEGORIES[ page.category ] ?? page.category} | Tags: ${page.tags.join( ', ' )} | Status: ${page.status}\n`;
  full += `${'='.repeat( 72 )}\n\n`;
  full += `${page.content}\n`;
}
fs.writeFileSync( path.join( OUT_DIR, 'llms-full.txt' ), full );

// ---------- manifest.json ----------
const manifest = {
  site: SITE_URL,
  title: SITE_TITLE,
  description: SITE_SUMMARY,
  generated: new Date().toISOString(),
  documentCount: pages.length,
  documents: pages.map( ( { content, ...metadata } ) => ( {
    ...metadata,
    url: `${SITE_URL}${metadata.path}`
  } ) )
};
fs.writeFileSync( path.join( OUT_DIR, 'manifest.json' ), JSON.stringify( manifest, null, 2 ) + '\n' );

console.log( `Validated ${pages.length} documents. Wrote llms.txt, llms-full.txt, manifest.json to docs/public/.` );
