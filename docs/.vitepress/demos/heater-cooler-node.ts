import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Text, VBox } from 'scenerystack/scenery';
import { HeaterCoolerNode } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const heatCoolAmountProperty = new NumberProperty( 0, {
    range: new Range( -1, 1 )
  } );

  const readout = new Text( 'Heat/cool: 0%' );

  const heaterCoolerNode = new HeaterCoolerNode( heatCoolAmountProperty, {
    scale: 0.6
  } );

  heatCoolAmountProperty.link( amount => {
    readout.string = `Heat/cool: ${Math.round( amount * 100 )}%`;
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      heaterCoolerNode
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    heaterCoolerNode.dispose();
    heatCoolAmountProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
