import { BooleanProperty } from 'scenerystack/axon';
import { VBox, Text } from 'scenerystack/scenery';
import { AccordionBox } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const expandedProperty = new BooleanProperty( false );

  const advancedContent = new VBox( {
    spacing: 6,
    children: [
      new Text( 'Precision: High' ),
      new Text( 'Quality: Maximum' ),
      new Text( 'Frame Rate: 60 fps' )
    ]
  } );

  const accordionBox = new AccordionBox( advancedContent, {
    titleNode: new Text( 'Advanced Settings' ),
    expandedProperty: expandedProperty
  } );

  rootNode.addChild( accordionBox );
  const unlinkCenter = centerInDisplay( accordionBox, width, height );

  return () => {
    unlinkCenter();
    accordionBox.dispose();
    advancedContent.dispose();
    expandedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
