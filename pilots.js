'use strict';

class Ship extends Thing {
	constructor(o) {

	}

	init(o) {
		this.controls = new ShipControls({'ship' : this});
	}
}

class ShipControls {
	constructor(o) {
		this.ship = o['ship'];

		this.controlThruster = 0;
		this.controlTurnLeft = 0;
		this.controlTurnRight = 0;

		this.thruster = new Thruster();
		this.turner = new Turner();
	}

	parseGamepadInput(input) {
		this.controlThruster = input.buttons[0].value;
		this.controlTurnLeft = input.buttons[4].value;
		this.controlTurnRight = input.buttons[5].value;
	}

	loop() {
		if (this.controlThruster) {
			this.thruster.accelerate();
		} else {
			this.thruster.deccelerate();
		}

		applyThrust(this);	
	}
}

class Thruster {
	constructor(o) {
		this.power = 0;
		this.maxPower = 10;
	}

	accelerate() {
		this.power++;
		if (this.power > this.maxPower) {
			this.power = this.maxPower;
		}
	}

	deccelerate() {
		this.power--;
		if (this.power < 0) {
			this.power = 0;
		}
	}
}

class Turner {
	constructor(o) {
		this.ship = o['ship'];
		this.rate = 6;
	}

	turnLeft() {
		this.ship.r -= this.rate;
		if (this.ship.r < 0) {
			this.ship.r += 360;
		}
	}

	turnRight() {
		this.ship.r += this.rate;
		if (this.ship.r > 360) {
			this.ship.r -= 360;
		}
	}
}