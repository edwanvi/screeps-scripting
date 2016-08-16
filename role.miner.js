/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	run: function (creep) {
		// first, find the flags in this room.
		// second, filter out all that don't start with 'miningFlag'
		// third, memorize the flag that matches our role.
		// ten = magic number that means flags only 
		if (creep.memory.miner_number == null) {
			var miner_number = creep.memory.role.substring(5, 6);
			creep.memory.miner_number = miner_number;
		}
		// now we need to find our flag
		if (creep.memory.flag == null) {
			if (creep.memory.miner_number == 1) {
				creep.memory.flag = Game.flags.miningFlag1;
			} else {
				creep.memory.flag = Game.flags.miningFlag2;
			}
		} else if (creep.carry.energy < creep.carryCapacity) {
			// move to flag, start mining
			var source = creep.memory.flag.pos.findClosestByRange(FIND_SOURCES);
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.flag);
            }
		} else if (creep.carry.energy == creep.carryCapacity) {
			// we're full captain!
			if (creep.memory.container_id == null) {
				// we need to know what our container is for the future.
				creep.memory.container_id = creep.memory.flag.pos.findClosestByRange(FIND_MY_STRUCTURES, 
					{filter: (structure) => structure.type == "container"}).id;
			} else {
				// deposit energy
			}
		}
	}
};