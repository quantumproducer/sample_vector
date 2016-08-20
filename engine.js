"use strict";

class Game {
	constructor(options) {
		this.init(options);
		this.canvas = options['canvas'];
		this.client = options['client'];
		this.resetBoard();
		this.resetGame();

		Thing.lineWidth = 1;
	}

	init(o) {

	}

	parseGamepadInput(playerIndex, input) {
		// this.players[playerIndex].handle('input', input);
		this.players[playerIndex].grab('controls').parseGamepadInput(input);
	}

	parseMusicSound(key_pressed_map, key_up_map) {
		if (key_pressed_map['M1']) {
			if (this.menuKey == 'M1') {
				return;
			}

			if (this.client.musician) {
				this.client.musician.toggle();	
			}
			
			this.menuKey = 'M1';
		} else if (key_up_map['M1']) {
			if (this.menuKey == 'M1') {
				this.menuKey = null;
			}
		}

		if (key_pressed_map['S1']) {
			if (this.menuKey == 'S1') {
				return;
			}

			Option.mute = !Option.mute;
			this.menuKey = 'S1';
		} else if (key_up_map['S1']) {
			if (this.menuKey == 'S1') {
				this.menuKey = null;
			}
		}
	}

	parseInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map) {
		//override
	}

	loopKeyboardInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map) {
		this.parseInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map);
	}	

	setupPlayers() {
		this.players = {};
	}

	setupUI() {
		
	}

	resetBoard() {
		this.board = [];
		this.things = {};
	}

	resetGame() {
		this.resetBoard();
		this.setupPlayers();
		this.setupUI();
	}

	add(group_name, thing) {
		if (!this.things[group_name]) {
			this.things[group_name] = [];
		}

		var group = this.things[group_name];
	
		group.push(thing);
	}


	destroyThings(to_destroy, group_name) {
		var group = this.things[group_name];
		if (!group) {
			return [];
		}
		for (var i = 0; i < to_destroy.length; i++) {
			var index = group.indexOf(to_destroy[i]);
			
			if (index >= 0) {
				group.splice(index, 1);
			}
		}
		
		return group;
	}

	outOfBounds(thing) {
 		return thing.x < -10 || thing.y < -10 || thing.x > this.fw || thing.y > this.fh;
	}

	groupNames() {
		return Object.keys(this.things);		
	}

	handleOutOfBounds(group_name, thing) {
		thing.gone = true;
	}

	shouldDestroyThing(group_name, thing) {
		return false;
	}

	checkBounds(group_name, thing) {
		if (this.outOfBounds(thing)) {
			this.handleOutOfBounds(group_name, thing);
		}
	}

	loopInteractions(thing) {
		var knows = thing.knows();
		for (var i = 0; i < knows.length; i++) {
			var kind = knows[i];
			var group = this.things[kind];
			for (var j = 0; j < group.length; j++) {
				var other = group[j];
				if (thing.cares(other)) {
					if (thing.can(other)) {
						thing.does(other);
					}
				}
			}
		}
	}

	groupLoop(group_name, dt) {
		var to_destroy = [];

		var group = this.things[group_name];
		if (group == undefined) {
			return;
		}

		for (var i = 0; i < group.length; i++) {
			var thing = group[i];
			if (thing.active === true) {
				thing.loop(dt, this);
				this.loopInteractions(thing);
				thing.afterLoop();	
			}

			this.checkBounds(group_name, thing);

			if (this.shouldDestroyThing(group_name, thing)) {
				thing.gone = true;
			}

			if (thing.gone) {
				to_destroy.push(thing);
			}

			if (thing.endedRound) {
				return;
			}
		}

		group = this.destroyThings(to_destroy, group_name);			
		this.things[group_name] = group;
	}

	loop(dt) {
		if (this.paused) {
			return;
		}
		var group_names = this.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {
			this.groupLoop(group_names[group_index], dt);
		}
	}

	destroyThingsInRadius(group_name, point, radius) {
		var things = this.things[group_name];
		if (!things) {
			return;
		}
		for (var i = 0; i < things.length; i++) {
			var thing = things[i];
			if (getDistance(thing.position(), point) <= radius) {
				thing.gone = true;
			}
		}
	}

	onMoveComplete(req) {
		this.announceMove(req);
		this.evaluateResolution();
	}

	evaluateResolution() {
		//override
	}

	onKeyUp(key) {
	}

	onKeyDown(key) {

	}

	onMouseUp(x, y) {

	}

	onMouseDown(x, y) {

	}

}

class Component {
	constructor(o) {
		this.components = {};
	}

	install(name, c) {
		this.components[name] = c;
	}

	grab(name) {
		return this.components[name];
	}

	loop() {
		
	}

	loopComponents() {
		var keys = Object.keys(this.components);
		for (let key of keys) {
			var c = this.components[key];
			this.components[key].loop();
		}
	}
}

class Inertia extends Component {
	constructor(o) {
		super(o);
		this.mass = o['mass'];
		this.theta = o['theta'];	
		this.magnitude = o['magnitude'] ? o['magnitude'] : 0;
		this.thing = o['thing'];
	}

	loop() {
		var thing = this.thing;
		var origin = {'x' : thing.x, 'y': thing.y};
    var tp = [thing.x, thing.y - 1];
    var np = rotate_point(tp[0], tp[1], origin.x, origin.y, this.theta);
    thing.mx = np.x - thing.x;
    thing.my = np.y - thing.y;
    var p = this.magnitude;
    thing.x = thing.x + thing.mx * p;
    thing.y = thing.y + thing.my * p;
	}
}

class Thing extends Component {
	constructor(options) {
		super(options);
		this.components = {};
		if (options && options['position']) {
			this.x = options['position'].x;
			this.y = options['position'].y;
		} else {
			this.x = 2.0;
			this.y = 2.0;	
		}
		this.mx = 0;
		this.my = 0;
		this.active = true;

		this.init(options);
	}

	knows() {
		return [];
	}

	cares() {
		return false;
	}

	can() {
		return false;
	}

	does() {
		return {};
	}

	init(o) {
		if (!o) {
			return;
		}
	}

	speedMod() {
		return 1.0;
	}

	move(dt) {
		lateralMove(this);
	}

	loop(dt) {

	}	

	afterLoop() {
		this.loopComponents();
	}

	speed() {
		return 1.0;
	}

	position() {
		return {'x' : this.x, 'y' : this.y};
	}
}

