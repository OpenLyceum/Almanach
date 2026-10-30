import { SpinningIndicatorNode } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const indicator = new SpinningIndicatorNode( {
    diameter: 90,
    numberOfElements: 12,
    elementFactory: SpinningIndicatorNode.circleFactory,
    activeColor: '#2E5F8A',
    inactiveColor: 'rgba(46,95,138,0.15)'
  } );

  rootNode.addChild( indicator );
  const unlinkCenter = centerInDisplay( indicator, width, height );

  // The demo canvas has no shared step loop, so drive the animation here.
  let lastTime = performance.now();
  let frameId = requestAnimationFrame( function tick( now: number ): void {
    const dt = ( now - lastTime ) / 1000;
    lastTime = now;
    indicator.step( dt );
    frameId = requestAnimationFrame( tick );
  } );

  return () => {
    cancelAnimationFrame( frameId );
    unlinkCenter();
    indicator.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
