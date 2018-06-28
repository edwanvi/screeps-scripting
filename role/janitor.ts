import { RoleBuilder } from "role/builder";
import { ExUt } from "../extrautils";
import { ExtendedCreep } from "creep_extension";

export class RoleJanitor {
  // a function to run the logic for this role
  public static run(creep: Creep) {
    // if creep is trying to complete a constructionSite but has no energy left
    if (creep.memory["working"] && creep.carry.energy == 0) {
      // switch state
      creep.memory["working"] = false;
    }
    // if creep is harvesting energy but is full
    else if (!creep.memory["working"] && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory["working"] = true;
    }
    var targets;
    if (Game.getObjectById(Game.spawns["Spawn1"].memory["towerId"])) {
        targets = creep.room.find(FIND_STRUCTURES,
            {filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_RAMPART});
    } else {
        targets = creep.room.find(FIND_STRUCTURES,
            {filter: object => object.hits < object.hitsMax});
    }
    // sort by dmg
    // TODO: USE A FASTER ALGORITHM
    targets.sort((a,b) => a.hits - b.hits);

    if(creep.memory.working) {
      if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {reusePath:30, maxRooms: 1});
      } else if (targets.length == 0) {
        RoleBuilder.run(creep);
      }
    } else {
      ExtendedCreep.getEnergy(creep, true, false);
    }
  }
}
