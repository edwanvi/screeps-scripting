module.exports = {
	run: function (creep) {
		//this role goes to a flag, mines around it, and deposits stuff at spawn.
		if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        //if we need to harvest energy
        if (creep.memory.working) {
        	creep.moveTo(Game.flags.remoteMining);
        	var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
	}
}