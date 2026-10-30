import { BooleanProperty } from 'scenerystack/axon';
import { LockNode } from 'scenerystack/scenery-phet';
import { RectangularPushButton } from 'scenerystack/sun';
import { Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 320;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isLockedProperty = new BooleanProperty( true );

  const lockNode = new LockNode( isLockedProperty, { scale: 0.7 } );
  const frame = new Node( { children: [ lockNode ], localBounds: lockNode.localBounds.dilated( 4 ) } );

  const readout = new Text( '' );
  const update = ( locked: boolean ): void => {
    readout.string = locked ? 'locked' : 'unlocked';
  };
  isLockedProperty.link( update );

  const toggle = new RectangularPushButton( {
    content: new Text( 'Toggle lock', { fontSize: 16 } ),
    listener: () => { isLockedProperty.toggle(); }
  } );

  const panel = new VBox( { spacing: 18, align: 'center', children: [ frame, readout, toggle ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    isLockedProperty.unlink( update );
    toggle.dispose();
    frame.dispose();
    lockNode.dispose();
    readout.dispose();
    panel.dispose();
    isLockedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
