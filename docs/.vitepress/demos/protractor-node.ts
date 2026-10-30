import { ProtractorNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const protractor = new ProtractorNode( {
    rotatable: true,
    scale: 0.6
  } );

  const readout = new Text( '' );
  const update = ( angle: number ): void => {
    readout.string = `angle: ${( angle * 180 / Math.PI ).toFixed( 0 )}° — drag the outer ring to rotate`;
  };
  protractor.angleProperty.link( update );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [ protractor, readout ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    protractor.angleProperty.unlink( update );
    protractor.dispose();
    readout.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
