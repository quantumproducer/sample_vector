'use strict';

class CloneSpawner {
	static run(f, clone, bullet) {
		f.showWeaponName();
		Game.transition = Option.transitionReset;
		var c = new Clone({'r' : 0, 'battlefield' : f, 'arsenalIndex' : f.p1.arsenalIndex});
		c.game = f;
		c.x = 0.5 * c.fw;
		c.y = 1/8 * c.fh;
		var record = f.getPilotPattern(1)
		c.recordPlayer = new RecordPlayer({'record' : record});
		f.resetPilotPattern();
		f.add('ships', c);
		f.assignKillsLeft();
		f.resetAllBullets();
		f.deadline.reset();
		if (f.nokills) {
			f.scoreDisplay.points = 1;
			f.nokills = false;
		}
	}
}

class CoopCloneSpawner {
	static run(f, clone, bullet) {
		f.showWeaponName();
		Game.transition = Option.transitionReset;
		var amount = 1;
		if (f.p2.active == false) {
			amount = 2;
		}
		for (var i = 0; i <amount; i++) {
			var c = new Clone({'r' : 0, 'battlefield' : f, 'bullet_team' : 'bullets2', 'arsenalIndex' : f.p1.arsenalIndex});
			c.team = 'clone';
			c.game = f;
			if (i == 1) {
				c.flip = -1;
			}
			c.x = 0.5 * c.fw;
			c.y = 1/8 * c.fh;
			c.recordPlayer = new RecordPlayer({'record' : f.getPilotPattern(1)});
			f.add('ships', c);		
		}
		
		amount = 1;
		if (f.p1.active == false) {
			amount = 2;
		}
		for (var i = 0; i <amount; i++) {
			var c2 = new Clone({'r' : 0, 'battlefield' : f, 'bullet_team' : 'bullets2', 'arsenalIndex' : f.p1.arsenalIndex});
			c2.team = 'clone';
			if (i == 1) {
				c2.flip = -1;
			}
			c2.game = f;
			c2.x = 0.5 * c2.fw;
			c2.y = 1/8 * c2.fh;
			c2.p2 = true;
			c2.recordPlayer = new RecordPlayer({'record' : f.getPilotPattern(2)});
		}
		
		f.resetPilotPattern();
		f.add('ships', c2);	
		// f.assignKillsLeft();
		f.resetAllBullets();
		f.deadline.reset();
		if (f.nokills) {
			f.scoreDisplay.points = 1;
			f.nokills = false;
		}

		f.killCounter.recordKill();
	}
}

class TournamentCloneSpawner {
	static run(f, pilot, bullet) {
		var c;
		var h;
		f.resetPilotPositions();
		if (pilot == f.p1) {
				var c = new TournamentClone({'r' : pilot.r, 'battlefield' : f, 'arsenalIndex' : 0, 'team' : 'p1', 'targets' : ['p2']});
				c.teamColor = f.p1.teamColor;
				c.shipDrawColor = f.p2.teamColor;
				var record = f.p2.recorder.saveRecording();
				f.p1.recorder.saveRecording();
				c.recordPlayer = new RecordPlayer({'record' : record});
				c.y = f.p1.y;
				c.sy = c.y;
				c.r = pilot.r;
		} else if (pilot == f.p2) {
				var c = new TournamentClone({'r' : pilot.r, 'battlefield' : f, 'arsenalIndex' : 0, 'team' : 'p2', 'targets' : ['p1']});
				var record = f.p1.recorder.saveRecording();
				f.p2.recorder.saveRecording();
				c.recordPlayer = new RecordPlayer({'record' : record});
				c.teamColor = f.p2.teamColor;
				c.shipDrawColor = f.p1.teamColor;
				c.y = f.p2.y;
				c.sy = c.y;
				c.r = pilot.r;
				// h = QuantumPilot.y;
		}
		
		c.game = f;
		c.x = 0.5 * c.fw;
		// c.y = h;

		f.resetPilotPattern();
		
		f.add('ships', c);
		f.resetAllClones();
		f.resetAllBullets();		
	}
}