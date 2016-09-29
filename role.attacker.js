const roleremoteminer = require('role.remoteminer');
const roledismantler = require('role.dismantler');

module.exports = {
	run: function (creep) {
		//this role goes to a flag and lays waste to the base it goes to
		// THIS IS THE ONLY FILE WHERE USING findClosestByPath IS ACCEPTABLE
		if (Game.spawns.Spawn1.memory.invading) {
			if (creep.room.name === Game.flags.attack.pos.roomName && creep.pos.inRangeTo(Game.flags.attack.pos, 30)) {
				var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
				if (targets) {
					if (creep.rangedAttack(targets) == ERR_NOT_IN_RANGE || creep.attack(targets) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets);
					} else {
						roledismantler.run(creep);
					}
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
