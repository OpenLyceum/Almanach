import { NumberProperty } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';
import { RectangularPushButton } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 120;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const countProperty = new NumberProperty( 0 );
  const label = new Text( 'Step (0)' );

  const button = new RectangularPushButton( {
    content: label,
    baseColor: 'yellow',
    listener: () => {
      countProperty.value++;
    }
  } );

  countProperty.link( count => {
    label.string = `Step (${count})`;
  } );

  rootNode.addChild( button );
  const unlinkCenter = centerInDisplay( button, width, height );

  return () => {
    unlinkCenter();
    button.dispose();
    countProperty.dispose();
    label.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
