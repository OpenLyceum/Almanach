import { BooleanProperty } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { Checkbox, Panel } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const gravityEnabledProperty = new BooleanProperty( true );
  const frictionEnabledProperty = new BooleanProperty( false );

  const controls = new VBox( {
    spacing: 8,
    align: 'left',
    children: [
      new Text( 'Simulation Options' ),
      new Checkbox( gravityEnabledProperty, new Text( 'Gravity' ) ),
      new Checkbox( frictionEnabledProperty, new Text( 'Friction' ) )
    ]
  } );

  const panel = new Panel( controls, {
    fill: '#f0f0f0',
    stroke: 'black',
    xMargin: 10,
    yMargin: 10
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    controls.dispose();
    gravityEnabledProperty.dispose();
    frictionEnabledProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
