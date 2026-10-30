import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HBox, VBox, Text } from 'scenerystack/scenery';
import { HSlider } from 'scenerystack/sun';
import { ThermometerNode } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const temperatureProperty = new NumberProperty( 20, {
    range: new Range( -20, 50 )
  } );

  const readout = new Text( '20 °C' );

  const thermometer = new ThermometerNode( temperatureProperty, -20, 50, {
    bulbDiameter: 40,
    tubeHeight: 150,
    tickSpacingTemperature: 10
  } );

  const slider = new HSlider( temperatureProperty, new Range( -20, 50 ), {
    trackSize: new Dimension2( 160, 5 )
  } );

  const container = new HBox( {
    spacing: 20,
    align: 'center',
    children: [
      thermometer,
      new VBox( {
        spacing: 10,
        align: 'center',
        children: [ readout, slider ]
      } )
    ]
  } );

  temperatureProperty.link( value => {
    readout.string = `${Math.round( value )} °C`;
  } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    container.dispose();
    thermometer.dispose();
    slider.dispose();
    temperatureProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
