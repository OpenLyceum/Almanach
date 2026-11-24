import { spawnSync } from 'node:child_process';
import { globSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// Keep the temporary modules beneath the repo so package imports resolve as they do in demos.
const tempDir = mkdtempSync( resolve( 'node_modules', '.almanach-examples-' ) );

try {
  let exampleCount = 0;
  for ( const file of globSync( 'docs/**/*.md', { exclude: [ 'docs/public/**' ] } ) ) {
    const markdown = readFileSync( file, 'utf8' );
    const codeBlocks = markdown.matchAll( /^<!-- typecheck -->\r?\n```ts\r?\n([\s\S]*?)^```[ \t]*\r?$/gm );
    let blockNumber = 0;

    for ( const block of codeBlocks ) {
      const examplePath = join( tempDir, `${file}.${++blockNumber}.mts` );
      const precedingLines = markdown.slice( 0, block.index ).split( '\n' ).length + 1;
      mkdirSync( dirname( examplePath ), { recursive: true } );
      writeFileSync( examplePath, '\n'.repeat( precedingLines ) + block[ 1 ] );
      exampleCount++;
    }
  }

  if ( exampleCount === 0 ) {
    throw new Error( 'No Markdown examples marked for type-checking were found.' );
  }

  const config = join( tempDir, 'tsconfig.json' );
  writeFileSync( config, JSON.stringify( {
    extends: resolve( 'tsconfig.demos.json' ),
    include: [ 'docs/**/*.mts' ]
  } ) );

  const result = spawnSync( process.execPath, [
    resolve( 'node_modules/typescript/bin/tsc' ), '-p', config, '--pretty', 'false'
  ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'pipe' ] } );
  if ( result.error ) {
    throw result.error;
  }
  if ( result.status !== 0 ) {
    // Point diagnostics at the original Markdown pages and lines.
    process.stderr.write( result.stdout.replace( /node_modules[\\/]\.almanach-examples-[^\\/]+[\\/]([^\r\n]+?\.md)\.\d+\.mts/g, '$1' ) );
    process.stderr.write( result.stderr );
    process.exitCode = result.status ?? 1;
  }
  else {
    console.log( `Type-checked ${exampleCount} Markdown examples.` );
  }
}
finally {
  rmSync( tempDir, { recursive: true, force: true } );
}
