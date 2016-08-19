"use strict";

class GameClient extends Client {
	installGame() {
		this.game = new TitleGame({canvas: this.canvas, client: this});
		Option.mute = false;
	}
}