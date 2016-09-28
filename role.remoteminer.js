const rolejanitor = require('role.janitor');

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
		// if we need to harvest energy
  	if (!creep.memory.working) {
			if (creep.room.name === Game.flags.remoteMining.pos.roomName) {
				var sources = creep.room.find(FIND_SOURCES);
	    	if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	    		creep.moveTo(sources[0], {reusePath: 50});
				}
  		} else {
				creep.moveTo(Game.flags.remoteMining, {reusePath:50});
			}
		} else {
			// take energy back to the tower, we're full!
			var towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER)}});
			if(towers.length > 0 && creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.spawns.Spawn1, {reusePath:50});
			} else if (towers.length > 0 && creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_FULL) {
				// if the spawn if full, take it somewhere else.
				var targets = creep.room.find(FIND_STRUCTURES, {
	        filter: (structure) => {
	          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
	            structure.energy < structure.energyCapacity;
	          }
	        });
	      if(targets.length > 0) {
	        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	          creep.moveTo(targets[0], {reusePath:50});
	      	}
				} else {
					// console.log("how the f*ck");
					rolejanitor.run(creep);
				}
			}
		}
	}
};
