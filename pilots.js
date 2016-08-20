'use strict';

class Ship extends Thing {
	constructor(o) {
		super(o);
	}

	init(o) {
		this.r = 65;
		var controls = new ShipControls({'ship' : this});
		this.install('controls', controls);
		var inertia = new Inertia({'mass' : 10, 'theta' : 130, 'magnitude' : 0.3, 'thing' : this});
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

		//Without this if statement, the ship will move towards top right
		//Even when thrust is not active!
		if (m1 > -0.1 && m1 < 0.1) {
			return;
		}
		console.log(m1);
		//m1 is 0 when gamepad button is not active.
		//m1 is 0.4 when the gamepad thrust button is active.

		var inertia = this.ship.grab('inertia');
		var t2 = inertia.theta;
		var m2 = inertia.magnitude;
		
		// console.log(m2);

		//Kim is Inertia
		//Noah is Thrust
		var kimVX = (m2 * Math.cos(t2 * Math.PI / 180));
		var kimVY = (m2 * Math.sin(t2 * Math.PI / 180));

		console.log("Inertia Vector.x" + kimVX);
		console.log("Inertia Vector.y" + kimVY);
		// return;

		var noahVX = (m1 * Math.cos(t1 * Math.PI / 180));
		var noahVY = (m1 * Math.sin(t1 * Math.PI / 180));

		console.log("Thrust Vector.x:" + noahVX);
		console.log("Thrust Vector.y:" + noahVY);
		// return;

		var resultVX = kimVX + noahVX;
		var resultVY = kimVY + noahVY;

		console.log("Resulting Vector.x" + resultVX);
		console.log("Resulting Vector.y" + resultVY);
		// return;

		//So far the console.logs match within 2 decimal places of the example
		//

		var c = resultVX * resultVX + resultVY * resultVY;
		console.log(c); //Expected to equal ~0.3522 since the example is 3522.25
		//and magnitudes are scaled down by a factor of 100
		// return;
		if (c != 0) {


		var resultMagnitude = Math.sqrt(c);
		console.log("Resulting vector magnitude" + resultMagnitude);
		// return;

		var resultTheta = (Math.atan( (resultVY) / (resultVX) )) * 180 / Math.PI ;
		console.log(resultTheta);
		// return;

		inertia.magnitude = resultMagnitude;
		inertia.theta = resultTheta;
		}
	}
}

class Thruster extends Component {
	constructor(o) {
		super(o);
		this.power = 0;
		this.maxPower = 0.1;
	}

	accelerate() {
		this.power = 0.4;
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
		console.log(this.ship.r);
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
