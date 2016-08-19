"use strict";

class Option {
	constructor(o) {
		this.on = this.default();
	}

	default() {
		return false;
	}

	run(game) {
		if (this.on) {
			this.execute(game);		
		}
	}

	text() {
		return this.title() + ": " + (this.on ? "ON" : "OFF");
	}

	toggle() {
		this.on = !this.on;
	}

}

class RegenerateOption extends Option {
	title() {
		return "Regeneration";
	}

	name() { //strategy name
		return "regenerate";
	}

	execute(game) {
		//regen	
	}
}

class CookingOption extends Option {
	title() {
		return "Cooking";
	}

	name() { //strategy name
		return "cooking";
	}

	execute(game) {
		//cook
	}	

	default() {
		return true;
	}
}