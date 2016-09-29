const roleremoteminer = require('role.remoteminer');

module.exports = {
	run: function (creep) {
		//this role goes to a flag and lays waste to the base it goes to
		// THIS IS THE ONLY FILE WHERE USING findClosestByPath IS ACCEPTABLE
		if (Game.spawns.Spawn1.memory.invading === false) {
			if (creep.room.name === Game.flags.attack.pos.roomName) {
				var targets = creep.room.findClosestByPath(FIND_HOSTILE_CREEPS);
	    	if (creep.attack(targets) == ERR_NOT_IN_RANGE) {
	    		creep.moveTo(targets);
				}
  		} else {
				creep.moveTo(Game.flags.attack, {reusePath:50, ignoreCreeps:true});
			}
		} else {
			// what if we aren't invading?
			roleremoteminer.run(creep);
		}
	}
};
