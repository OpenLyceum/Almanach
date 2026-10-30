import { BooleanProperty } from 'scenerystack/axon';
import { ExpandCollapseButton } from 'scenerystack/sun';
import { Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const expandedProperty = new BooleanProperty( true );

  const button = new ExpandCollapseButton( expandedProperty, {
    sideLength: 24
  } );

  const label = new Text( 'Details', { fontSize: 18 } );
  const content = new Rectangle( 0, 0, 180, 60, { fill: '#cfe3f7', cornerRadius: 6 } );

  const updateVisibility = ( expanded: boolean ): void => {
    content.visible = expanded;
  };
  expandedProperty.link( updateVisibility );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [ button, label, content ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    expandedProperty.unlink( updateVisibility );
    button.dispose();
    label.dispose();
    content.dispose();
    panel.dispose();
    expandedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
