/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('specs');
 * mod.thing == 'a thing'; // true
 */

module.exports.harvesterSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
module.exports.upgraderSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
module.exports.builderSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
module.exports.janitorSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
module.exports.attackerSpecs = [RANGED_ATTACK, MOVE, MOVE, CARRY, WORK];
module.exports.cheapAttackerSpecs = [TOUGH,MOVE,WORK,CARRY,ATTACK];
// gloabl values
global.REUSE_PATH_TICKS = 50;
global.MOVE_TO_OPTS = {reusePath: global.REUSE_PATH_TICKS, ignoreCreeps:true, maxOps: 1000};
