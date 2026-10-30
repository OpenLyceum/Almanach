import { BooleanProperty } from 'scenerystack/axon';
import { Checkbox } from 'scenerystack/sun';
import { RichText, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 240;

const MARKUP = 'H<sub>2</sub>O, E = mc<sup>2</sup>, <b>bold</b> and <i>italic</i>';
const PLAIN = 'H2O, E = mc2, bold and italic';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const richProperty = new BooleanProperty( true );

  const richText = new RichText( MARKUP, { font: '22px sans-serif', fill: '#333' } );
  const linkText = new RichText(
    'See <a href="{{phetWebsite}}">our website</a> for more.',
    {
      font: '18px sans-serif',
      fill: '#333',
      links: {
        phetWebsite: 'https://phet.colorado.edu'
      }
    }
  );

  const update = ( rich: boolean ): void => {
    richText.string = rich ? MARKUP : PLAIN;
  };
  richProperty.link( update );

  const checkbox = new Checkbox( richProperty, new Text( 'Render markup', { fontSize: 16 } ) );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ richText, linkText, checkbox ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    richProperty.unlink( update );
    checkbox.dispose();
    richText.dispose();
    linkText.dispose();
    panel.dispose();
    richProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
