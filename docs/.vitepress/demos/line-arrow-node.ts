import { LineArrowNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const solid = new LineArrowNode( 0, 0, 220, 0, {
    stroke: '#2E5F8A',
    headHeight: 18,
    headWidth: 22,
    headLineWidth: 3,
    tailLineWidth: 3
  } );

  const cueArrow = new LineArrowNode( 0, 0, 220, 0, {
    stroke: '#D9782D',
    headHeight: 18,
    headWidth: 22,
    headLineWidth: 3,
    tailLineWidth: 2,
    tailLineDash: [ 6, 4 ]
  } );

  const readout = new Text( 'setTailAndTip( 0, 0, 220, 0 )' );

  const configurations = [
    { tailX: 0, tailY: 0, tipX: 220, tipY: 0 },
    { tailX: 0, tailY: 0, tipX: 140, tipY: -80 },
    { tailX: 0, tailY: 0, tipX: 220, tipY: 60 },
    { tailX: 0, tailY: 0, tipX: 0, tipY: -120 }
  ];
  let step = 0;

  const button = new TextPushButton( 'Reposition (setTailAndTip)', {
    baseColor: '#D9782D',
    listener: () => {
      step = ( step + 1 ) % configurations.length;
      const config = configurations[ step ];
      cueArrow.setTailAndTip( config.tailX, config.tailY, config.tipX, config.tipY );
      readout.string = `setTailAndTip( ${config.tailX}, ${config.tailY}, ${config.tipX}, ${config.tipY} )`;
    }
  } );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ solid, cueArrow, readout, button ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    solid.dispose();
    cueArrow.dispose();
    readout.dispose();
    button.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
