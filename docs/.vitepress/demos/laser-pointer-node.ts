import { BooleanProperty } from 'scenerystack/axon';
import { Dimension2 } from 'scenerystack/dot';
import { LaserPointerNode } from 'scenerystack/scenery-phet';
import { Node, Rectangle } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 380;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const onProperty = new BooleanProperty( false );

  const laser = new LaserPointerNode( onProperty, {
    bodySize: new Dimension2( 90, 60 ),
    nozzleSize: new Dimension2( 16, 48 ),
    hasButton: true,
    buttonType: 'toggle',
    hasGlass: true
  } );

  // A beam that appears while the laser is on; drawn to the right of the nozzle.
  const beam = new Rectangle( laser.right, laser.centerY - 4, 150, 8, { fill: '#FF3B30' } );
  const updateBeam = ( on: boolean ): void => { beam.visible = on; };
  onProperty.link( updateBeam );

  const stage = new Node( { children: [ beam, laser ] } );

  rootNode.addChild( stage );
  const unlinkCenter = centerInDisplay( stage, width, height );

  return () => {
    unlinkCenter();
    onProperty.unlink( updateBeam );
    laser.dispose();
    beam.dispose();
    stage.dispose();
    onProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
