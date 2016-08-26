// import external

import React from 'react';

// get time

const startTime = Date.now();

// export

export default class Fractal extends React.Component {

	constructor (options) {
		super();
		this.canvasId = options[0];
		this.targetId = options[1];
		this.frame = this.frame.bind(this);
	}

	componentDidMount () {
		this.canvas = document.getElementById(this.canvasId);
		this.target = document.getElementById(this.targetId);
		this.gl = this.canvas.getContext('experimental-webgl');

		const {fragment, frame, gl, vertex} = this;

		// compile shaders

		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertex);
		gl.compileShader(vertexShader);

		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragment);
		gl.compileShader(fragmentShader);

		// create program

		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);
		gl.useProgram(this.program);

		// create geometry

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				-1.0, -1.0,
				 1.0, -1.0,
				-1.0,  1.0,
				 1.0,  1.0
			]),
			gl.STATIC_DRAW
		);

		// start render loop

		this.animation = requestAnimationFrame(frame);
	}

	frame () {
		const {canvas, gl, program, target} = this;

		// adjust dimensions

		if (canvas.height !== target.scrollHeight || canvas.width !== target.scrollWidth) {
			canvas.height = target.scrollHeight;
			canvas.width = target.scrollWidth;
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		}

		// attributes

		const positionLocation = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		// uniforms

		const time = Date.now() - startTime;
		gl.uniform1f( gl.getUniformLocation(program, 'time'), time / 1000 );
		gl.uniform2f( gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height);

		// draw

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		// request next frame

		this.animation = requestAnimationFrame(this.frame);
	}

	componentWillUnmount () {
		window.cancelAnimationFrame(this.animation);
	}

}
