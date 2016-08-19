'use strict';

class Musician {
	constructor() {
		this.index = 1;
		this.on = true;
	}

	play() {
		if (!this.on) {
			return;
		}
		var soundID = "m" + this.index + "-3.wav";
		var demo2Sound = soundManager.createSound({
 		url: soundID,
	 	onfinish: function() {
	   	this.musician.advance();
	 	}
		});
		demo2Sound.musician = this;
		demo2Sound.play({
		  volume: 100
		});

		this.activeTrack = demo2Sound;
	}

	advance() {
		this.index++;
		if (this.index > 4) {
			this.index = 1;
		}

		this.play();
	}

	toggle() {
		this.on = !this.on;
		if (this.activeTrack) {
			if (this.on) {
				this.activeTrack.resume();
			} else {
				this.activeTrack.pause();
			}
		}
	}

}

