'use strict';

class Ship extends Thing {
	constructor(o) {
		super(o);
	}

	init(o) {
		this.r = 65;
		var controls = new ShipControls({'ship' : this});
		this.install('controls', controls);
		var inertia = new Inertia({'mass' : 10, 'theta' : 130, 'magnitude' : 30, 'thing' : this});
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

		this.applyThrust();
	}

	applyThrust() {
		var t1 = this.ship.r; //rotation, the theta the ship is facing
		var m1 = this.ship.grab('thruster').power;

		var inertia = this.ship.grab('inertia');
		var t2 = inertia.theta;
		var m2 = inertia.magnitude;
		
		// console.log(m2);

		//Kim is Inertia
		//Noah is Thrust
		var kimVX = (m2 * Math.cos(t2 * Math.PI / 180));
		var kimVY = (m2 * Math.sin(t2 * Math.PI / 180));

		// console.log(kimVX);
		// console.log(kimVY);
		// return;

		var noahVX = (m1 * Math.cos(t1 * Math.PI / 180));
		var noahVY = (m1 * Math.sin(t1 * Math.PI / 180));

		// console.log(noahVX);
		// console.log(noahVY);
		// return;

		var resultVX = kimVX + noahVX;
		var resultVY = kimVY + noahVY;

		// console.log(resultVX);
		// console.log(resultVY);
		// return;

		var resultMagnitude = Math.sqrt(resultVX * resultVX + resultVY * resultVY);
		// console.log(resultMagnitude);

		var resultTheta = Math.atan( Math.abs(resultVY) / Math.abs(resultVX) );
		console.log(resultTheta);

		inertia.magnitude = resultMagnitude;
		inertia.theta = resultTheta;
		return;

		// console.log(kimVX);
		// console.log(noahVX);
		// return;

		console.log(resultVectorX);
		// console.log(resultVectorY);

		var c = (resultVectorX * resultVectorX) + (resultVectorY + resultVectorY);
		var resultMagnitude = Math.sqrt(c);
		
		// console.log(resultMagnitude);

		var atan = Math.atan(resultVectorY / resultVectorX);
		// console.log(atan);
		// var resultTheta = atan * 180 / Math.PI;

		// console.log(resultTheta);

		inertia.magnitude = resultMagnitude;
		inertia.theta = atan;
	}
}

class Thruster extends Component {
	constructor(o) {
		super(o);
		this.power = 40;
		this.maxPower = 5;
	}

	accelerate() {
		this.power = 40;
		return;
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
