import { BooleanProperty, NumberProperty, StringProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { Checkbox, HSlider } from 'scenerystack/sun';
import { ValueGaugeNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 360;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 100 );
  const valueProperty = new NumberProperty( 40, { range: range } );
  const labelProperty = new StringProperty( 'kPa' );

  const gauge = new ValueGaugeNode( valueProperty, labelProperty, range, {
    radius: 90,
    numberDisplayOptions: {
      decimalPlaces: 1
    }
  } );

  const slider = new HSlider( valueProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const numberDisplayVisibleProperty = new BooleanProperty( true );
  const numberDisplayVisibleListener = ( visible: boolean ) => {
    gauge.numberDisplayVisible = visible;
  };
  numberDisplayVisibleProperty.link( numberDisplayVisibleListener );

  const numberDisplayCheckbox = new Checkbox( numberDisplayVisibleProperty, new Text( 'Show numeric readout' ) );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ gauge, slider, numberDisplayCheckbox ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    slider.dispose();
    numberDisplayCheckbox.dispose();
    numberDisplayVisibleProperty.unlink( numberDisplayVisibleListener );
    numberDisplayVisibleProperty.dispose();
    gauge.dispose();
    panel.dispose();
    labelProperty.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
