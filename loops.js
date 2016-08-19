'use strict';

class Loops {
	static install(game) {
			game.loopShip = function(ship) {
				ship.weapon.shipLoop(ship);
			}

			game.loopForGroup['kill-counter'] = function(thing, game) {
				if (thing.reached()) {
					game.advanceArsenal();
				}
				return thing;
			}

			game.loopForGroup['deadline'] = function(thing, game) {
			if (Math.floor(thing.charge) == thing.maxCharge - 1) {
				game.playWarning();
			}

			if (thing.y >= game.p1.y) {
				game.playStaticSound();
				var index = game.p1.arsenalIndex;
				var clones = game.things['clones1'].length;
				var points = game.scoreDisplay.points;
				game.resetGame();
				game.assignKillsLeft(game.things['clones1'].length);
				game.scoreDisplay.points = points;
				
				if (index == 0 && clones == 1) {
					game.scoreDisplay.active = false;
					game.helper.active = true;
				} else {
					game.scoreDisplay.active = true;
					game.helper.active = false;	
				}
				
			}
			return thing;
		}

		game.loopForGroup['clones1'] = function(thing, game) {
			thing.team = 'clone';
			var actions = thing.recordPlayer.playback();
			// if (actions && actions['firing'] == false) {
				game.loopShip(thing);	
			// }

			if (game.deadline.y > thing.y) {
				if (!thing.red) {
					
				}
				thing.red = true;
			}
			
			if (thing.respawning > 0) {
				thing.respawning--;
			}
			wrapClone(thing);

			if (thing.y > game.furthest1) {
				game.assignFurthest1(thing.y);
			}

			return thing;
		}

		game.loopForGroup['bullets1'] = function(thing, game) {
			// if (thing.y > game.furthest1 + 112) {
			// 	return thing;
			// }

			wrapBullet(thing);

			var hitIndex = -1;
			for (var i = 0; i < game.things['clones1'].length; i++) {
				var clone = game.things['clones1'][i];
				if (!clone.active) {
					clone.firing = false;
					clone.weapon.shipLoop(clone);
					continue;
				}

				var hit = polygonContainsPoint(thing.position(), clone.shipVertexes());
				if (hit) {
					var color = clone.red ? "#FF0000" : clone.teamColor;
					console.log("color" + color);
					game.spawnBulletVortex(clone.position(), color);


					thing.gone = true;
					hitIndex = i;
					break;
				}	
			}

			if (hitIndex >= 0) {
				clone.index = hitIndex;
				game.runStrategy('clone_hit', clone, thing);
			}

			return thing;
		}

		game.loopForGroup['bullets2'] = function(thing, game) {
			if (thing.y < game.furthest2 - 112) {
				return thing;
			}
		

				if (thing.x < 0) {
					if (thing.ox) {
						thing.mx = Math.abs(thing.mx);
					} else {
						thing.x = thing.fw;	
					}
					
				} else if (thing.x > thing.fw) {
					if (thing.ox) {
						thing.mx = -Math.abs(thing.mx);
					} else {
						thing.x = 0;
					}
					
				}	
			
			var pilots = game.things['p1'];
			var hit = false;
			var pilotHit = 0;
			for (var i = 0; i < pilots.length; i++) {
				var pilot = pilots[i];
				hit = polygonContainsPoint(thing.position(), pilot.quantumCollisionVertexes());
				pilotHit = i + 1;
				if (hit) {
					game.spawnBulletVortex(thing.position(), pilot.teamColor);
					break;
				}
			}

		
			if (hit) {
				game.playExplosionSound();
				var points = game.scoreDisplay.points;
				if (pilotHit == 1) {
					QuantumPilot.x = game.p1.x;
					QuantumPilot.y = game.p1.y;	
				} else {
					QuantumPilot.x = game.p2.x;
					QuantumPilot.y = game.p2.y;	
				}
				
				game.resetGame();
				if (pilotHit == 1) {
					game.spawnBulletVortex(game.p1.position(), pilot.teamColor);
				} else {
					game.spawnBulletVortex(game.p2.position(), pilot.teamColor);
				}
				game.assignKillsLeft(game.things['clones1'].length);
				game.scoreDisplay.points = points;
				game.scoreDisplay.active = true;
				game.helper.active = false;
			}

			return thing;
		}

		game.loopForGroup['p1'] = function(thing, game) { //bad pointer to have to return this
			// game.loopShip(thing);
			// if (Game.transition) {
			// }
			// if (thing.y < game.furthest2) {
			// 	game.assignFurthest2(thing.y);
			// }
			// console.log("imprintin");
			// wrapPilot(thing);

			// game.loopSoundDelay();
			// return thing;
		}
	}
}