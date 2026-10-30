import { Node, Rectangle, VBox } from 'scenerystack/scenery';
import { Carousel, PageControl, type CarouselItem } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5', '#D5B15B' ];

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const items: CarouselItem[] = COLORS.map( color => ( {
    createNode: () => new Rectangle( 0, 0, 50, 50, { fill: color, cornerRadius: 8 } )
  } ) );

  const carousel = new Carousel( items, {
    orientation: 'horizontal',
    itemsPerPage: 2,
    margin: 8
  } );

  const pageControl = new PageControl(
    carousel.pageNumberProperty,
    carousel.numberOfPagesProperty,
    {
      interactive: true,
      orientation: 'horizontal'
    }
  );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [ carousel, pageControl ]
  } );

  const container = new Node( { children: [ panel ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    pageControl.dispose();
    carousel.dispose();
    panel.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
