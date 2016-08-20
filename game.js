'use strict';

class ComboRockets extends Game {
	setupPlayers() {
		this.players = [];
		var p = new Ship();
		p.x = 50;
		p.y = 50;
		this.players.push(p);
		this.add('ships', p);
	}
}
