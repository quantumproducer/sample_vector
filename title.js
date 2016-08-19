'use strict';

class TitleGame extends Game {
	loadHandler(event) {
	}

	resetGame() {
		super.resetGame();
		this.border = new TitleBorder();
		this.things['borders'] = [this.border];

		this.menu = new Menu();
		this.menu.game = this;
		this.add('menus', this.menu);

		this.title = new Title();
		this.title.unstarted = true;
		this.add('title', this.title);

		this.scrolling = false;

		this.buttoned = 0;
	}

	parseInput(key_pressed_map, key_up_map) {
		this.parseMusicSound(key_pressed_map, key_up_map);

		if (this.scrolling == 'D1' && key_up_map['D1']) {
			this.scrolling = false;
		} else if (this.scrolling == 'U1' && key_up_map['U1']) {
			this.scrolling = false;
		} else if (this.scrolling == 'A1' && key_up_map['A1']) {
			this.scrolling = false;
		}
 
		if (this.scrolling) {
			return;
		}

		if (key_pressed_map['D1']) {
			this.menu.scroll(1);
			this.scrolling = 'D1';
		}

		if (key_pressed_map['U1']) {
			this.menu.scroll(-1);
			this.scrolling = 'U1';
		}

		if (key_pressed_map['A1']) {
			this.menu.toggleOption();
			this.scrolling = 'A1';
		}
	}

	parseGamepadInput(playerIndex, input) {
		if (input.y > 0.5) {
			if (!this.scrolling) {
				this.menu.scroll(1);	
				this.scrolling = true;
			}
		} else if (input.y < -0.5) {
			if (!this.scrolling) {
				this.menu.scroll(-1);	
				this.scrolling = true;
			}
		} else {
			this.scrolling = false;
		}
		
		if (input.buttons[0].pressed || input.buttons[1].pressed || input.buttons[2].pressed || input.buttons[4].pressed || input.buttons[5].pressed) {
			this.buttoned++;
			if (this.buttoned > 0 && this.menu.loaded) { 
				var g = [QuantumPilot2, CoopQuantumPilot2, TournamentIntro, Poem][this.menu.index];
				this.client.musician.play();
				this.client.game = new g({client: this.client, context: this.context});	
			}
		}
		
	}
}
