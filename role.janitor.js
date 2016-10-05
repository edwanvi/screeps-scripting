const roleBuilder = require('role.builder');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is trying to complete a constructionSite but has no energy left
    if (creep.memory.working && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working === false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }
    // manually spawned creep w/no memory
    else if (creep.memory.working == undefined) {
      creep.memory.working = false;
    }

    var targets = creep.room.find(FIND_STRUCTURES,
      {filter: object => object.hits < object.hitsMax});
    // sort by dmg
    // TODO: USE A FASTER ALGORITHM
    // targets.sort((a,b) => a.hits - b.hits);

    if(creep.memory.working) {
      if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], global.MOVE_TO_OPTS);
      } else if (targets.length == 0) {
        roleBuilder.run(creep);
      }
    } else {
      // find closest source
      var source = creep.pos.findClosestByRange(FIND_SOURCES, {algorithm: 'astar'});
      // try to harvest energy, if the source is not in range
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // move towards the source
        creep.moveTo(source, global.MOVE_TO_OPTS);
      }
    }
  }
}
