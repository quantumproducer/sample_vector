'use strict';


class Weapon {
	static color() {
		return "#FFFFFF";
	}

	static arsenal() {
		return [Dismantler, Paster, NovaSplitter, GammaHammer, Exoslicer, SpaceMelter];
	}

	static tournamentArsenal() {
		return [NovaSplitter, GammaHammer, Exoslicer, SpaceMelter];
	}

	static soundID() {
		return "exo";
	}

	static shipLoop(ship) {

	}

	static allPatternOptions(ship) {
		return {position: ship.firePosition(), teamColor: this.color(), r: ship.r};
	}

	static patternOptions(ship) {
		return [{'r' : ship.r}];
	}

	static bulletClass() {
		return Laser;
	}

	static pattern(ship) {
		var bullets = [];
		for (var i = 0; i < this.patternOptions(ship).length; i++) {
			var c = this.bulletClass();
			var b = new c(this.allPatternOptions(ship));
			b.init(this.patternOptions(ship)[i]);
			b.shipIndex = ship.index;
			bullets.push(b);
			b.targets = ship.targets;
		}

		return bullets;
	}
}

class Dismantler extends Weapon {
	static name() {
		return "Dismantler";
	}

	static soundID() {
		return "dismantler";
	}
}

class NovaSplitter extends Weapon {
	static name() {
		return "NovaSplitter";
	}

	static color() {
		return "#FFA300";
	}

	static patternOptions(ship) {
		return [{'r' : ship.r + 10.2}, {'r' : ship.r + -10.2}];
	}

	static soundID() {
		return "nova";
	}
}

class GammaHammer extends Weapon {
	static name() {
		return "GammaHammer";
	}

	static color() {
		return "#FFFF00";
	}

	static patternOptions(ship) {
		return [{'r' : ship.r + 20.6, 'thruster' : 0.8}, {'r' : ship.r + -20.6, 'thruster' : 0.8}, {'r' : ship.r, 'thruster' : 0.5}];
	}

	static soundID() {
		return "gamma";
	}
}

class SpaceMelter extends Weapon {
	static name() {
		return "SpaceMelter";
	}
	

	static color() {
		return "#FF00BB";
	}

	static patternOptions(ship) {
		return [{'r' : ship.r + -25.2}, {'r' : ship.r + 25.2}, {'r': ship.r + 10 }, {'r' : ship.r + -10}];
	}

	static soundID() {
		return "melt";
	}
}

class Exoslicer extends Weapon {
	static name() {
		return "Exoslicer";
	}
	
	static color() {
		return "#00FFFF";
	}

	static bulletClass() {
		return ExoLaser;
	}

	static allPatternOptions(ship) {
		var opts = super.allPatternOptions(ship);
		opts.ox = ship.x;
		opts.my = 0.6 * (ship.r == 0 ? -1 : 1);
		return opts;
	}

	static patternOptions(ship) {
		return [{'mx' : -1}, {'mx' : 1}];
	}

	static soundID() {
		return "exo";
	}	
}

class Laser extends Thing {
	constructor(options) {
		super(options);
		this.size = 3;
		this.speed = 7.2 * 0.7;
	}

	init(o) {
		super.init(o);
		this.r = o['r'];
		this.shipIndex = o['shipIndex'];
		if (o['thruster']) {
			this.thruster = o['thruster'];
		} else {
			this.thruster = 1;
		}
	}

	speedMod() {
		return 1.0 * Thing.bulletSpeed;
	}

	knows() {
		return ['ships'];
	}

	cares(t) {
		return this.targets.indexOf(t.team) >= 0 && t.active == true && t.index != this.shipIndex;
	}

	can(t) {
		return polygonContainsPoint(this, t.shipVertexes());
	}

	does(t) {
		if (!this.gone) {
			t.hit(this);	
			this.gone = true;
		}
	}

	thrustPower() {
		return this.speed * this.thruster;
	}

	move() {
		applyThrust(this);
		wrapBullet(this);
	}

}

class ExoLaser extends Laser {
	constructor(o) {
		super(o);
		this.oscillateSpeed = 0.03;
		this.delay = 0;
		this.ox = o['ox'];
		this.reached = false;
		ExoLaser.delayReset = 15;
	}

	move() {
		lateralMove(this);
		wrapBullet(this);
	}

	shouldTurn() {
		return (this.mx < 0 && this.x < this.ox) || (this.mx > 0 && this.x > this.ox);
	}

	oscillate() {
		if (this.delay > 0) {
			this.delay--;
		} else {
			if (this.x > this.ox) {
				this.mx = this.mx - this.oscillateSpeed;
			} else if (this.x < this.ox) {
				this.mx = this.mx + this.oscillateSpeed;
			}
		}
	}

	loop() {
		if (!this.reached) {
			var turn = this.shouldTurn();
			super.loop();
			this.y += 2 * this.my;
			this.oscillate();
			if (turn && !this.shouldTurn()) {
				this.delay = ExoLaser.delayReset;
			}
		} else {
			this.x += this.mx * this.speed();
			if (Math.abs(this.position.x - this.ox) >= 14) {
				this.reached = true;
				this.loop();
			}
		}
	}
}

class Paster extends Weapon {
	static name() {
		return "MoonCutter";
	}
	

	static color() {
		return "#CC2277";
	}

	static patternOptions(ship) {
		return [{'r' : ship.r, 'shipIndex' : ship.index}];
	}

	static bulletClass() {
		return Paste;
	}

	static shipLoop(ship, force) {
		if (!ship.firing) {

			var bullets = ship.game.things['bullets'];
			if (!bullets) {
				return;
			}
			for (var i = 0; i < bullets.length; i++) {
				var b = bullets[i];
				if (b.pasteLaunch == 1 && ship.index == b.shipIndex) {
					if (b.pasteCascade > 18 || force == true) {
						b.pasteLaunch = 2;	
					}
					
				}
			}
		}
	}
}

class Paste extends Laser {
	init(o) {
		super.init(o);
		this.shipIndex = o['shipIndex'];
		this.pasteLaunch = 1;
		this.pasteCascade = 0;
		this.thruster = 0.0;
		this.shipIndex = o['shipIndex'];
	}

	
	loop() {
		super.loop();	
		
		if (this.pasteLaunch == 1) {
			this.pasteCascade++;
		} else if (this.pasteLaunch == 2) {
			this.pasteCascade--;
			if (this.pasteCascade <= 0) {
				this.launch();
			}
		} else if (this.pasteLaunch == 3) {
			if (this.thruster < 1.3) {
				this.thruster+= 0.02;
			}
		}
	}

	launch() {
		this.pasteLaunch = 3;
		this.thruster = 0.2;
	}
}