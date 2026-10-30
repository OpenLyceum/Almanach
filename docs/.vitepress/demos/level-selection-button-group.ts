import { NumberProperty, Property } from 'scenerystack/axon';
import { LevelSelectionButtonGroup, type LevelSelectionButtonGroupItem } from 'scenerystack/vegas';
import { PhetFont } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 440;
export const height = 280;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const selectedProperty = new NumberProperty( 0 );

  const scores = [ new Property( 2 ), new Property( 5 ), new Property( 0 ) ];

  const items: LevelSelectionButtonGroupItem[] = scores.map( ( scoreProperty, i ) => ( {
    icon: new Text( `${i + 1}`, { font: new PhetFont( 32 ) } ),
    scoreProperty: scoreProperty,
    options: { listener: () => { selectedProperty.value = i + 1; } }
  } ) );

  // Tandem.OPTIONAL satisfies PickRequired<'tandem'> for the demo host; not for PhET-iO.
  const group = new LevelSelectionButtonGroup( items, {
    tandem: Tandem.OPTIONAL,
    levelSelectionButtonOptions: { baseColor: '#DCEBFB' },
    flowBoxOptions: { spacing: 16 },
    groupButtonWidth: 120,
    groupButtonHeight: 120,
    gameLevels: [ 1, 2, 3 ]
  } );

  const readout = new Text( '' );
  const update = ( selected: number ): void => {
    readout.string = selected === 0 ? 'pick a level' : `level ${selected} selected`;
  };
  selectedProperty.link( update );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ group, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    selectedProperty.unlink( update );
    group.dispose();
    readout.dispose();
    panel.dispose();
    scores.forEach( s => s.dispose() );
    selectedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
