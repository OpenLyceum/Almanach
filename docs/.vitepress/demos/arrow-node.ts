import { Text, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { ArrowNode } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const arrow = new ArrowNode( 0, 0, 120, -50, {
    fill: 'red',
    stroke: 'red',
    headHeight: 14,
    headWidth: 14,
    tailWidth: 5
  } );

  const readout = new Text( 'Force: 130 N at 23°' );

  let step = 0;
  const configurations = [
    { tailX: 0, tailY: 0, tipX: 120, tipY: -50 },
    { tailX: 0, tailY: 0, tipX: -80, tipY: -100 },
    { tailX: 0, tailY: 0, tipX: 150, tipY: 30 },
    { tailX: 0, tailY: 0, tipX: 0, tipY: -120 }
  ];

  const descriptions = [
    'Force: 130 N at 23°',
    'Force: 128 N at 128°',
    'Force: 153 N at 11°',
    'Force: 120 N at 90°'
  ];

  const button = new TextPushButton( 'Next Vector', {
    baseColor: '#5C8741',
    listener: () => {
      step = ( step + 1 ) % configurations.length;
      const config = configurations[ step ];
      arrow.setTailAndTip( config.tailX, config.tailY, config.tipX, config.tipY );
      readout.string = descriptions[ step ];
    }
  } );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      arrow,
      button
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    arrow.dispose();
    button.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
