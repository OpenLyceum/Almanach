import { BooleanProperty } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';
import { Checkbox } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 120;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const gravityEnabledProperty = new BooleanProperty( true );

  const checkbox = new Checkbox(
    gravityEnabledProperty,
    new Text( 'Gravity' ),
    {
      boxWidth: 16,
      checkboxColor: 'blue',
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }
  );

  rootNode.addChild( checkbox );
  const unlinkCenter = centerInDisplay( checkbox, width, height );

  return () => {
    unlinkCenter();
    checkbox.dispose();
    gravityEnabledProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
