import { ShadowText } from 'scenerystack/scenery-phet';
import { PhetFont } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 340;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const shadowText = new ShadowText( 'Scenery', {
    font: new PhetFont( { size: 48, weight: 'bold' } ),
    fill: '#5B9BD5',
    shadowFill: 'rgba(0,0,0,0.35)',
    shadowXOffset: 4,
    shadowYOffset: 4
  } );

  rootNode.addChild( shadowText );
  const unlinkCenter = centerInDisplay( shadowText, width, height );

  return () => {
    unlinkCenter();
    shadowText.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
