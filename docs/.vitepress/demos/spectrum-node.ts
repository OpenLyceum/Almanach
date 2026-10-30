import { Dimension2 } from 'scenerystack/dot';
import { SpectrumNode } from 'scenerystack/scenery-phet';
import { Color, Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  // A custom red-to-blue spectrum over a [0, 100] range.
  const spectrum = new SpectrumNode( {
    size: new Dimension2( 300, 60 ),
    minValue: 0,
    maxValue: 100,
    valueToColor: value => {
      const t = value / 100;
      return new Color( 255 * ( 1 - t ), 0, 255 * t );
    }
  } );

  const container = new Node( { children: [ spectrum ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    spectrum.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
