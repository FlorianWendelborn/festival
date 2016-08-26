// import internal

import Fractal from './';

// export

export default class CollectionFractal extends Fractal {

	constructor (options) {
		super(['collection-canvas', 'collection-target']);
		this.fragment = `
			#ifdef GL_FRAGMENT_PRECISION_HIGH
				precision highp float;
			#else
				precision mediump float;
			#endif

			#define SCALE 20.0
			#define ITERATIONS 15
			#define SPEED 10.0

			uniform float time;
			uniform vec2 resolution;

			float aspectX = resolution.x/resolution.y;
			float aspectY = 1.0;

			float scale = cos(time / 20.0) * SCALE + 10.0;

			void main(void) {
				float x = (gl_FragCoord.x / resolution.x - 0.5) * aspectX * scale;
				float y = (gl_FragCoord.y / resolution.y - 0.5) * aspectY * scale;

				float m = 0.0;

				float cx = sin(time / 1000.0 * SPEED) - 1.0;
				float cy = cos(time / 1000.0 * SPEED + 1.0) - 1.0;

				for (int i = 0; i < ITERATIONS; i++) {
					x = abs(x);
					y = abs(y);
					m = x*x + y*y;
					x = x / m + cx;
					y = y / m + cy;
				}

				gl_FragColor = vec4(
					1.0 - (cos(x) / 2.0 + .5),
					1.0 - (sin(y) / 2.0 + .5),
					1.0 - (sin(cos((m))) / 2.0 + .5),
					1.0
				);
			}
		`;

		this.vertex = `
			attribute vec2 a_position;
			void main() {
				gl_Position = vec4(a_position, 0, 1);
			}
		`;
	}

}
