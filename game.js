'use strict';

class ComboRockets extends Game {
	setupPlayers() {
		this.players = [];
		var p = new Ship();
		p.x = 450;
		p.y = 450;
		this.players.push(p);
		this.add('ships', p);
	}
}
