import { Property } from 'scenerystack/axon';
import { Node, Text, VBox } from 'scenerystack/scenery';
import { ComboBox, type ComboBoxItem } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

type Units = 'meters' | 'feet' | 'cubits';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const unitsProperty = new Property<Units>( 'meters' );

  const readout = new Text( 'Units: meters' );

  const listParent = new Node();

  const items: ComboBoxItem<Units>[] = [
    { value: 'meters', createNode: () => new Text( 'meters' ) },
    { value: 'feet', createNode: () => new Text( 'feet' ) },
    { value: 'cubits', createNode: () => new Text( 'cubits' ) }
  ];

  const unitsComboBox = new ComboBox( unitsProperty, items, listParent );

  unitsProperty.link( units => {
    readout.string = `Units: ${units}`;
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      readout,
      unitsComboBox
    ]
  } );

  rootNode.addChild( panel );
  rootNode.addChild( listParent );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    unitsComboBox.dispose();
    listParent.dispose();
    unitsProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
