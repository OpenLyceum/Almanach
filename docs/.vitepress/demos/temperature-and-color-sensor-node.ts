import { NumberProperty, Property } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { TemperatureAndColorSensorNode } from 'scenerystack/scenery-phet';
import { Color, Node, type TColor, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 340;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 100 );
  const temperatureProperty = new NumberProperty( 40, { range: range } );
  const colorProperty = new Property<TColor>( Color.BLUE );

  const updateColor = ( temperature: number ): void => {
    const t = ( temperature - range.min ) / ( range.max - range.min );
    colorProperty.value = new Color( Math.round( 40 + 215 * t ), 60, Math.round( 255 - 215 * t ) );
  };
  temperatureProperty.link( updateColor );

  const sensor = new TemperatureAndColorSensorNode( temperatureProperty, range, colorProperty, {
    thermometerNodeOptions: {
      bulbDiameter: 40,
      tubeHeight: 120
    }
  } );
  const frame = new Node( { children: [ sensor ], localBounds: sensor.localBounds.dilated( 4 ) } );

  const slider = new HSlider( temperatureProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ frame, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    temperatureProperty.unlink( updateColor );
    slider.dispose();
    frame.dispose();
    sensor.dispose();
    panel.dispose();
    colorProperty.dispose();
    temperatureProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
