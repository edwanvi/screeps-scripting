var extrautils = require('extrautils');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is bringing energy to the spawn but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }
    // get an energysource if we don't have one
    if (creep.memory.energysource == null) {
      extrautils.newsource.run(creep);
    }
    // make the spawn store the paths from spawn -> energy
    var sources = creep.room.find(FIND_SOURCES);
    if (Game.spawns.Spawn1.memory.source0path == null) {
      Game.spawns.Spawn1.memory.source0path = Room.serializePath(creep.room.findPath(Game.spawns.Spawn1.pos, sources[0].pos, {ignoreCreeps:true}));
    }
    else if (Game.spawns.Spawn1.memory.source1path == null) {
      Game.spawns.Spawn1.memory.source1path = Room.serializePath(creep.room.findPath(Game.spawns.Spawn1.pos, sources[1].pos, {ignoreCreeps:true}));
    }
    // if creep is supposed to transfer energy to the spawn
    if (creep.memory.working == true) {
      // try to transfer energy, if the spawn is not in range
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < structure.energyCapacity;
          }
        });
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {reusePath:20});
        }
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      var sources = creep.room.find(FIND_SOURCES)
      if (creep.harvest(sources[creep.memory.energysource]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[creep.memory.energysource], {reusePath:20})
      }
    }
  }
};
