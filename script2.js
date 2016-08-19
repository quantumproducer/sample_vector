"use strict";

class Recorder {
	constructor(options) {
		this.record = [];
		if (options['record']) {
			for (var i = 0; i < options['record'].length; i++) {
				this.record.push(options['record'][i]);
			} //why do pointers work? //this.record = options['record'];
		}
		this.timeIndex = 0;
		this.timeDirection = 0;
		this.recording = true;
	}

	imprint(actions) {
		this.record.push(actions);
		this.timeIndex++;
	}

	saveRecording() {
		this.recording = false;
		return this.record;
	}

	restart() {
		this.timeIndex = 0;
		this.timeDirection = 1;
		this.record = [];
	}
}

class RecordPlayer extends Recorder {
	constructor(options) {
		super(options);
		this.restart();
	}

	playback() {
			var currentIndex = this.timeIndex;
			this.timeIndex = this.timeIndex + this.timeDirection;

			this.oscillateTime();
			
			return this.record[currentIndex];
	}

	oscillateTime() {
			if (this.timeIndex > this.record.length - 1) {
				this.timeIndex = this.record.length - 1;
				this.timeDirection = -1;
			} else if (this.timeIndex < 0) {
				this.timeIndex = 0;
				this.timeDirection = 1;
 			}
	}

	restart() {
		this.timeIndex = 0;
		this.timeDirection = 1;
	}

	accumulativeActions(ticks) {
		var index = this.timeIndex;
		var tDir = this.timeDirection;
		var acts = {};

		while (ticks > 0) {
			index += this.timeDirection;

			if (index > this.record.length - 1) {
				index = this.record.length - 1;
			  tDir = -1;
			} else if (index < 0) {
				index = 0;
				tDir = 1;
			}

			if (!this.record[index]) {
				return {'mx' : 0, 'my': 0};
			}

			var actionsAtIndex = this.record[index];
			// console.log(actionsAtIndex);
			var keys = Object.keys(actionsAtIndex);
			// console.log("keys" + keys);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				// console.log("key" + key);
				// console.log("acts key" + acts[key]);
				if (!acts[key]) {
					acts[key] = actionsAtIndex[key];
					// console.log("assigning" + acts[key]);
				} else {
					acts[key] = acts[key] + actionsAtIndex[key] * tDir;
					// console.log("acts" + key + "" + acts[key]);
				}
			}

			ticks--;
		}

		// console.log("acts" + acts['mx']);

		return acts;
	}
	
}