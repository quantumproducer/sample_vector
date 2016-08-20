'use strict';

class Ship extends Thing {
	constructor(o) {
		super(o);
	}

	init(o) {
		this.r = 0;
		var controls = new ShipControls({'ship' : this});
		this.install('controls', controls);
		var inertia = new Inertia({'mass' : 10, 'theta' : 90, 'thing' : this});
		this.install('inertia', inertia);
		this.install('thruster', new Thruster({'ship' : this}));
		this.install('turner', new Turner({'ship' : this}));
	}

}

class ShipControls extends Component {
	constructor(o) {
		super(o);
		this.ship = o['ship'];

		this.controlThruster = 0;
		this.controlTurnLeft = 0;
		this.controlTurnRight = 0;
	}

	parseGamepadInput(input) {
		this.controlThruster = input.buttons[0].value;
		this.controlTurnLeft = input.buttons[4].value;
		this.controlTurnRight = input.buttons[5].value;
	}

	loop() {
		if (this.controlThruster) {
			this.ship.grab('thruster').accelerate();
		} else {
			this.ship.grab('thruster').deccelerate();
		}

		if (this.controlTurnLeft) {
			this.ship.grab('turner').turnLeft();
		}

		if (this.controlTurnRight) {
			this.ship.grab('turner').turnRight();
		}

		applyThrust(this.ship);	
	}
}

class Thruster extends Component {
	constructor(o) {
		super(o);
		this.power = 0;
		this.maxPower = 5;
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

class Turner extends Component {
	constructor(o) {
		super(o);
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
