'use strict';

class Title extends Thing {
	constructor(o) {
		super(o);

		this.maxCharacter = 0;
		this.charUpDelay = 5;
	}

	loop() {
		if (this.charUpDelay > 0 && this.maxCharacter < 100) {
			this.charUpDelay--;
			if (this.charUpDelay <= 0) {
				this.charUpDelay = 25;
				if (this.maxCharacter > 2) {
					this.charUpDelay = 5;
					if (this.maxCharacter > 15) {
						this.charUpDelay = 25;
					}
				}
				this.maxCharacter++;
				if (this.unstarted) {
					if (Option.mute) {
						return;
					}
					if (this.maxCharacter < this.text().length) {
						createjs.Sound.play(GammaHammer.soundID());
					}
					// } else if (this.maxCharacter < this.text1().length - 2) {
					// 	createjs.Sound.play(NovaSplitter.soundID());
					// } else if (this.maxCharacter < this.text1().length + 4) {
					// 	createjs.Sound.play(NovaSplitter.soundID());
					// 	// this.playExplosionSound();
					// }	
				}		
			}
		}
	}

	text() {
		return "www.combo.zone".substring(0, this.maxCharacter);
	}
}

class Menu extends Thing {
	init(o) {
		this.optionClasses = [RegenerateOption, CookingOption];
		this.options = [];
		for (var i = 0; i < this.optionClasses.length; i++) {
			var o = this.optionClasses[i];
			var opt = new o();
			this.options.push(opt);
		}

		this.index = 0;

		this.maxOptionDisplay = 0;
	}

	toggleOption() {
		var o = this.options[this.index];
		o.toggle();
	}

	loop() {
		if (this.maxOptionDisplay < this.options.length) {
			this.maxOptionDisplay++;
		}
	}

	scroll(d) {
		this.index += d;
		if (this.index < 0) {
			this.index = this.options.length - 1;
		} else if (this.index > this.options.length - 1) {
			this.index = 0;
		}
	}
}

class BulletVortex extends Thing {
	constructor(options) {
		super(options);
		this.group_name = options['group_name'];
		this.teamColor = options['teamColor'];
		this.charge = 50;
	}

	loop() {
		this.charge-= 5;
		if (this.full()) {
			this.gone = true;
		};
	}

	full() {
		return this.charge <= 0;
	}
}

class SoundPlayer extends Thing {
	init(o) {
		super.init(o);
		this.soundDelay = 0;
	}

	loop(dt, game) {
		if (this.soundDelay > 0) {
			this.soundDelay--;
		}
	}
}

class Border extends Thing {
	loop(dt, game) {

	}
}

class TournamentBorder extends Thing {
	loop(dt, game) {

	}
}

class TitleBorder extends Border {
	loop(dt, game) {

	}	
}

class Pauser extends Border {

}

class TournamentIntroDisplay extends Thing {
	loop(dt, game) {
		 if (this.tick == undefined) {
		 	this.tick = 0;
		 } else {
		 	this.tick ++;
		 	if (this.tick >= 150) {
		 		game.startTournament();
		 	}
		 }
	}
}

class TournamentWinnerDisplay extends Thing {
	init(o) {
		this.p1infinities = o['p1i'];
		this.p2infinities = o['p2i'];
		this.winner = o['winner'];
		this.delay = 60;
		this.completed = false;
	}

	infinities(a) {
		return Array(a + 1).join(String.fromCharCode(0x221E));
	}

	loop(dt, game) {
		// this.winVortex.loop(dt, game);
		if (this.delay) {
			this.delay--;
			if (this.delay == 0) {
				this.nextDelay = 60;
				if (this.winner == 'p1') {
					this.p2infinities--;
				} else {
					this.p1infinities--;
				}
			}
		} else {
			this.nextDelay--;
			if (this.nextDelay <= 0) {
				this.completed = true;
				if (this.p1infinities == 0 || this.p2infinities == 0) {
					this.game.winnerShown();
				}
			}
		}
	}	
}