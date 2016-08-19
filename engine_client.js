"use strict";

class Client {
	styleCanvas(canvas) {
		var context = canvas.getContext('2d');
		context.textAlign = 'center';
		context.font = '30pt Courier New';
	}

	generateCanvas() {
		var canvas = document.getElementById('canvas');

		Thing.prototype.scale = 1;
		canvas.width = 800;
		canvas.height = 800;
		Thing.prototype.cw = canvas.width;
		Thing.prototype.ch = canvas.height;
		Thing.cw = Thing.prototype.cw;
		Thing.ch = Thing.prototype.ch;
		this.styleCanvas(canvas);	
		return canvas;
	}

	installRendering() {
		this.installCanvas();
		this.installBuffer();
	}

	installCanvas() {
		this.canvas = this.generateCanvas();
		document.getElementById("game_container").appendChild(this.canvas); 
	}

	installBuffer() {
//		this.buffer = this.generateCanvas();
	}

	installInput() {
		this.installMouseInput();
		this.installKeyboardInput();

	}

	installMouseInput() {
		this.canvas.addEventListener("click", this.onMouseDown.bind(this), false);
	}

	installKeyboardInput() {
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);

		this.key_down_map = {};
		this.key_depressing_map = {};
		this.key_pressing_map = {};
		this.key_up_map = {};

		this.key_map = {
			27: 'ESC',
			37: 'L1',
			38: 'U1',
			39: 'R1',
			40: 'D1',
			16: 'A1',
			// 32: 'A1',
			82: 'L2',
			70: 'U2',
			83: 'D2',
			84: 'R2',
			90: 'A2',

			77: 'M1',
			83: 'S1',

			49: 'DEBUG1',
			50: 'DEBUG2',
			51: 'DEBUG3',
			52: 'DEBUG4'
			

		}
	}

	installTime() {
		this.now, this.dt, this.last = Date.now();
		this.dt = 0.00;

		this.rate = 10;
	}


	installLoops() {
		window.requestAnimationFrame(this.loop.bind(this));
	}

	constructor(options) {
		this.installRendering();
		this.installInput();
		this.installGame()
		this.installTime();
		this.installLoops();
	}

	loop() {
		this.now = Date.now();
		var delta  = this.now - this.last;
		this.last = this.now;

		this.dt = this.dt + delta;

		if (this.dt < this.rate) {
			window.requestAnimationFrame(this.loop.bind(this));
			return;
		}

		while (this.dt > this.rate) {
			this.game.loop(delta);	
			this.dt -= delta;
		}
		
		this.draw();
		
		this.loopInput();

		window.requestAnimationFrame(this.loop.bind(this));
	}

	loopGamepadInput() {
		var pads = navigator.getGamepads();

		if (pads) {
			for (var i = 0; i < pads.length; i++) {
				var gp = pads[i];	
				if (!gp) {
					break;
				}
				var x = gp.axes[0];
				
	    	var y = gp.axes[1];
	    	x = (x > 0.1 || x < -0.1) ? x : 0;
	    	y = (y > 0.1 || y < -0.1) ? y : 0;

	    	if (x == 0 && y == 0) {
	    		x = gp.axes[2];
	    		y = gp.axes[3];

	    		x = (x > 0.1 || x < -0.1) ? x : 0;
	    		y = (y > 0.1 || y < -0.1) ? y : 0;
	    	}

	    	if (x > 0.9) {
	    		x = 1.0;
	    	} else if (x < -0.9) {
	    		x = -1.0;
	    	}

	    	if (y > 0.9) {
	    		y = 1.0;
	    	} else if (y < -0.9) {
	    		y = -1.0;
	    	}

				var input = {'x' : x, 'y': y, 'buttons' : gp.buttons};
				input = interpolateGamepad(input);
	    	// if (usingGamepad(input)) {
	    		this.game.parseGamepadInput(i, input);		
	    	// }	    	
			}
		}
			
	}

	loopInput() {
		this.game.loopKeyboardInput(this.key_down_map, this.key_up_map, this.key_pressing_map, this.key_depressing_map);
		this.loopGamepadInput();
	}

	draw() {
		this.setBackground();

		var group_names = this.game.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {
			var group = this.game.things[group_names[group_index]];

			for (var i = 0; i < group.length; i++) {
				var thing = group[i];
				if (thing.active) {
					thing.draw(this, this.context());
				}
			}

		}

		
	}

	context() {
		return this.canvas.getContext('2d');
	}

	drawRect(x,y,w,h, colour) {
		this.context().fillStyle = colour;
		this.context().fillRect(x,y,w,h)
	}

	setBackground() {
		this.context().clearRect(0, 0, this.canvas.width, this.canvas.height); //500
		this.context().fillStyle = "#000000";
		this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
	}


	installGame() {

	}

	onKeyUp(event) {
		this.key_down_map[this.key_map[event.keyCode]] = false;
		this.key_up_map[this.key_map[event.keyCode]] = true;
	}

	onKeyDown(event) { 
		this.key_down_map[this.key_map[event.keyCode]] = true;
		this.key_up_map[this.key_map[event.keyCode]] = false;
	}

	onMouseUp(event) {
		var x = event.layerX;
		var y = event.layerY;
		this.game.onMouseUp(x, y);
	}

	onMouseDown(event) {
		var x = event.layerX;
		var y = event.layerY;
		this.game.onMouseDown(x, y);
	}
}
