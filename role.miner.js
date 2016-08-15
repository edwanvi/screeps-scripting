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
		if (creep.memory.miner_number = 1) {
			creep.memory.flag = Game.flags.miningFlag1;
		} else {
			creep.memory.flag = Game.flags.miningFlag2;
		}
	}
};