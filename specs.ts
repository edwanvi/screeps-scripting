/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('specs');
 * mod.thing == 'a thing'; // true
 */

export const harvesterSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
export const upgraderSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
export const builderSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
export const janitorSpecs = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
export const attackerSpecs = [RANGED_ATTACK, MOVE, MOVE, CARRY, WORK];
export const cheapAttackerSpecs = [TOUGH,MOVE,WORK,CARRY,ATTACK];
