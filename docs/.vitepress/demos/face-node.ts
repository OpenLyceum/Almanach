import { BooleanProperty } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { FaceNode } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isHappyProperty = new BooleanProperty( true );

  const faceNode = new FaceNode( 100 );

  const statusText = new Text( 'Status: Correct ✓' );

  const toggleButton = new TextPushButton( 'Toggle Expression', {
    baseColor: '#6A2C91',
    listener: () => {
      isHappyProperty.value = !isHappyProperty.value;
    }
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      statusText,
      faceNode,
      toggleButton
    ]
  } );

  isHappyProperty.link( isHappy => {
    if ( isHappy ) {
      faceNode.smile();
      statusText.string = 'Status: Correct ✓';
    }
    else {
      faceNode.frown();
      statusText.string = 'Status: Incorrect ✗';
    }
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    faceNode.dispose();
    toggleButton.dispose();
    isHappyProperty.dispose();
    statusText.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
