import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { FineCoarseSpinner } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const numberProperty = new NumberProperty( 20, { range: new Range( 0, 100 ) } );

  const spinner = new FineCoarseSpinner( numberProperty, {
    deltaFine: 1,
    deltaCoarse: 10
  } );

  const container = new Node( { children: [ spinner ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    spinner.dispose();
    container.dispose();
    numberProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
