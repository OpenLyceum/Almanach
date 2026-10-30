import { Dimension2 } from 'scenerystack/dot';
import { Node, Rectangle } from 'scenerystack/scenery';
import { Carousel, type CarouselItem } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 160;

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5', '#D5B15B' ];

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const items: CarouselItem[] = COLORS.map( color => ( {
    createNode: () => new Rectangle( 0, 0, 60, 60, { fill: color, cornerRadius: 8 } )
  } ) );

  const carousel = new Carousel( items, {
    orientation: 'horizontal',
    itemsPerPage: 2,
    margin: 10,
    buttonOptions: {
      baseColor: 'rgb( 220, 220, 220 )',
      arrowSize: new Dimension2( 16, 6 )
    }
  } );

  const container = new Node( { children: [ carousel ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    carousel.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
