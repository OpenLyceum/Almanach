import { BooleanProperty, NumberProperty } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { FaucetNode } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const maxFlowRate = 10;
  const flowRateProperty = new NumberProperty( 0 );
  const enabledProperty = new BooleanProperty( true );

  const readout = new Text( 'Flow rate: 0.0 L/s' );

  const faucetNode = new FaucetNode( maxFlowRate, flowRateProperty, enabledProperty, {
    scale: 0.6,
    closeOnRelease: false
  } );

  flowRateProperty.link( rate => {
    readout.string = `Flow rate: ${rate.toFixed( 1 )} L/s`;
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      faucetNode
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    faucetNode.dispose();
    flowRateProperty.dispose();
    enabledProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
