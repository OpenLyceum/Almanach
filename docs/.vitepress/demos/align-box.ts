import { Property } from 'scenerystack/axon';
import { Bounds2 } from 'scenerystack/dot';
import { VerticalAquaRadioButtonGroup, type AquaRadioButtonGroupItem } from 'scenerystack/sun';
import { AlignBox, HBox, Node, Rectangle, Text } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 440;
export const height = 240;

type Corner = 'left-top' | 'center-center' | 'right-bottom';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const cornerProperty = new Property<Corner>( 'left-top' );

  const region = new Rectangle( 0, 0, 180, 160, { fill: '#e9eef5', stroke: '#8AA4C4' } );
  const content = new Rectangle( 0, 0, 50, 40, { fill: '#5B9BD5', cornerRadius: 4 } );
  const alignBox = new AlignBox( content, {
    alignBounds: new Bounds2( 0, 0, 180, 160 ),
    xAlign: 'left',
    yAlign: 'top'
  } );
  const stage = new Node( { children: [ region, alignBox ] } );

  const update = ( corner: Corner ): void => {
    const [ x, y ] = corner.split( '-' );
    alignBox.xAlign = x as 'left' | 'center' | 'right';
    alignBox.yAlign = y as 'top' | 'center' | 'bottom';
  };
  cornerProperty.link( update );

  const items: AquaRadioButtonGroupItem<Corner>[] = [
    { value: 'left-top', createNode: () => new Text( 'left / top', { fontSize: 15 } ) },
    { value: 'center-center', createNode: () => new Text( 'center / center', { fontSize: 15 } ) },
    { value: 'right-bottom', createNode: () => new Text( 'right / bottom', { fontSize: 15 } ) }
  ];
  const group = new VerticalAquaRadioButtonGroup<Corner>( cornerProperty, items, { spacing: 10 } );

  const panel = new HBox( { spacing: 28, align: 'center', children: [ stage, group ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    cornerProperty.unlink( update );
    group.dispose();
    alignBox.dispose();
    content.dispose();
    region.dispose();
    stage.dispose();
    panel.dispose();
    cornerProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
