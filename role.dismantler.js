const roleremoteminer = require('role.remoteminer');

module.exports = {
	run: function (creep) {
		//this role goes to a flag and lays waste to the base it goes to
		// THIS IS THE ONLY FILE WHERE USING findClosestByPath IS ACCEPTABLE
		if (Game.spawns.Spawn1.memory.invading) {
			if (creep.room.name === Game.flags.attack.pos.roomName && creep.pos.inRangeTo(Game.flags.attack.pos, 30)) {
				var targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
				targets.sort((a,b) => a.hits - b.hits);
				if (targets.length > 0) {
    			if (creep.dismantle(targets[0]) === ERR_NOT_IN_RANGE && targets[0].structureType != STRUCTURE_CONTROLLER) {
        		creep.moveTo(targets[0]);
    			} else if (targets[0].structureType === STRUCTURE_CONTROLLER) {
						if (creep.dismantle(targets[1]) === ERR_NOT_IN_RANGE) {
	        		creep.moveTo(targets[1]);
	    			}
    			}
				} else {
					// room cleanup done!
					roleremoteminer.run(creep);
					// TODO: Auto-stop invasions as this nearly killed the colony
				}
  		} else {
				creep.moveTo(Game.flags.attack);
			}
		} else {
			// what if we aren't invading?
			roleremoteminer.run(creep);
		}
	}
};
