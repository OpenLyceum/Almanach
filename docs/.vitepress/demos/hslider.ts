import { BooleanProperty, NumberProperty, Property } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { Text, VBox } from 'scenerystack/scenery';
import { Checkbox, HSlider } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 100 );
  const temperatureProperty = new NumberProperty( 20, {
    range: range
  } );
  const enabledRangeProperty = new Property( range );
  const narrowEnabledProperty = new BooleanProperty( false );

  const readout = new Text( '20 °C' );
  const slider = new HSlider( temperatureProperty, range, {
    trackSize: new Dimension2( 220, 5 ),
    enabledRangeProperty: enabledRangeProperty
  } );
  slider.addMajorTick( 0, new Text( '0°', { fontSize: 12 } ) );
  slider.addMajorTick( 100, new Text( '100°', { fontSize: 12 } ) );
  slider.addMinorTick( 25 );
  slider.addMinorTick( 50 );
  slider.addMinorTick( 75 );

  const updateNarrow = ( narrow: boolean ): void => {
    enabledRangeProperty.value = narrow ? new Range( 20, 80 ) : range;
  };
  narrowEnabledProperty.link( updateNarrow );

  const narrowCheckbox = new Checkbox( narrowEnabledProperty, new Text( 'Narrow enabled range' ) );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      slider,
      narrowCheckbox
    ]
  } );

  const updateReadout = ( value: number ): void => {
    readout.string = `${Math.round( value )} °C`;
  };
  temperatureProperty.link( updateReadout );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    temperatureProperty.unlink( updateReadout );
    narrowEnabledProperty.unlink( updateNarrow );
    panel.dispose();
    slider.dispose();
    narrowCheckbox.dispose();
    narrowEnabledProperty.dispose();
    enabledRangeProperty.dispose();
    temperatureProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
