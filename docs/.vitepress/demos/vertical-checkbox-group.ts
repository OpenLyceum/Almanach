import { BooleanProperty } from 'scenerystack/axon';
import { VerticalCheckboxGroup, type VerticalCheckboxGroupItem } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const gridProperty = new BooleanProperty( true );
  const labelsProperty = new BooleanProperty( false );
  const valuesProperty = new BooleanProperty( true );

  const items: VerticalCheckboxGroupItem[] = [
    { property: gridProperty, createNode: () => new Text( 'Grid', { fontSize: 18 } ) },
    { property: labelsProperty, createNode: () => new Text( 'Labels', { fontSize: 18 } ) },
    { property: valuesProperty, createNode: () => new Text( 'Values', { fontSize: 18 } ) }
  ];

  const group = new VerticalCheckboxGroup( items, {
    spacing: 12
  } );

  const readout = new Text( '' );
  const update = (): void => {
    const on = [
      gridProperty.value ? 'grid' : null,
      labelsProperty.value ? 'labels' : null,
      valuesProperty.value ? 'values' : null
    ].filter( x => x !== null );
    readout.string = `on: ${on.length ? on.join( ', ' ) : 'none'}`;
  };
  gridProperty.link( update );
  labelsProperty.link( update );
  valuesProperty.link( update );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ group, readout ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    gridProperty.unlink( update );
    labelsProperty.unlink( update );
    valuesProperty.unlink( update );
    group.dispose();
    readout.dispose();
    panel.dispose();
    gridProperty.dispose();
    labelsProperty.dispose();
    valuesProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
