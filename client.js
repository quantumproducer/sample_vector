"use strict";

class GameClient extends Client {
	installGame() {
		this.game = new ComboRockets({canvas: this.canvas, client: this});
	}
}