'use strict';

class ComboRockets extends Game {
	setupPlayers() {
		this.players = [];
		var p = new Ship();
		this.players.add(p);
	}
}
