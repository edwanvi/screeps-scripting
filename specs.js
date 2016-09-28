/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('specs');
 * mod.thing == 'a thing'; // true
 */

module.exports.harvesterSpecs = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
module.exports.upgraderSpecs = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
module.exports.builderSpecs = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
module.exports.janitorSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
// gloabl values
global.REUSE_PATH_TICKS = 50;
