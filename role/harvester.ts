// var extrautils = require('extrautils');
import { RoleJanitor } from "role.janitor"

export class RoleHarvester {
  public static run(creep: Creep) {
    if (creep.memory["working"] && creep.carry.energy == 0) {
      creep.memory["working"] = false;
    } else if (!creep.memory["working"] && creep.carry.energy == creep.carryCapacity) {
      creep.memory["working"] = true;
    }
    if (creep.memory["energysource"] == null) {
      RoleHarvester.newSource(creep);
    }
    var sources = creep.room.find(FIND_SOURCES);
    if (Game.spawns["Spawn1"].memory["source0path"] == null) {
      Game.spawns["Spawn1"].memory["source0path"] = Room.serializePath(creep.room.findPath(Game.spawns["Spawn1"].pos, sources[0].pos, { ignoreCreeps: true }));
    }
    else if (Game.spawns["Spawn1"].memory["source1path"] == null) {
      Game.spawns["Spawn1"].memory["source1path"] = Room.serializePath(creep.room.findPath(Game.spawns["Spawn1"].pos, sources[1].pos, { ignoreCreeps: true }));
    }
    if (creep.memory["working"]) {
      // try to transfer energy, if the spawn is not in range
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < structure.energyCapacity;
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { reusePath: 20 });
        }
      } else {
        RoleJanitor.run(creep);
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      var sources = creep.room.find(FIND_SOURCES)
      if (creep.harvest(sources[creep.memory.energysource]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[creep.memory.energysource], { reusePath: 20 })
      }
    }
  }
  private static newSource(creep: Creep) {
    if (Math.random() > 0.5) {
      creep.memory.energysource = 1;
    }
    else {
      creep.memory.energysource = 0;
    }
    console.log(creep + ' will harvest source ' + creep.memory.energysource + ' for role ' + creep.memory.role);
  }
}
