import { BooleanProperty, Property, StringProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { Checkbox, HSlider } from 'scenerystack/sun';
import { GaugeNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const speedRange = new Range( 0, 100 );

  // A plain Property (rather than NumberProperty) is used so the value can go
  // out of range or become NaN, to demonstrate GaugeNode's clamping/hiding behavior.
  const speedProperty = new Property<number>( 30 );
  const labelProperty = new StringProperty( 'm/s' );

  const gaugeNode = new GaugeNode( speedProperty, labelProperty, speedRange, {
    radius: 90
  } );

  // Slider range extends beyond the gauge's range so the needle can be pushed
  // out of bounds, demonstrating that it clamps rather than disappearing.
  const sliderRange = new Range( speedRange.min - 20, speedRange.max + 20 );
  const slider = new HSlider( speedProperty, sliderRange, {
    trackSize: new Dimension2( 200, 5 )
  } );

  const invalidReadingProperty = new BooleanProperty( false );
  const invalidReadingListener = ( invalid: boolean ) => {
    slider.enabled = !invalid;
    speedProperty.value = invalid ? NaN : 30;
  };
  invalidReadingProperty.link( invalidReadingListener );

  const invalidReadingCheckbox = new Checkbox( invalidReadingProperty, new Text( 'Invalid reading (NaN)' ) );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      gaugeNode,
      slider,
      invalidReadingCheckbox
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    gaugeNode.dispose();
    slider.dispose();
    invalidReadingCheckbox.dispose();
    invalidReadingProperty.unlink( invalidReadingListener );
    invalidReadingProperty.dispose();
    speedProperty.dispose();
    labelProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
