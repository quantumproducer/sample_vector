'use strict';

class ComboRockets extends Game {
	setupPlayers() {
		this.players = [];
		var p = new Ship();
		p.x = 100;
		p.y = 100;
		this.players.push(p);
		this.add('ships', p);
	}
}
