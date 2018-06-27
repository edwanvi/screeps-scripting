import { ExtendedCreep } from "creep_extension";

// beep beep lettuce
export class RoleTruck {
    public static run(creep: ExtendedCreep) {
        if (creep.memory["working"] == undefined || (creep.memory["working"] && creep.carry.energy == 0)) {
            creep.memory["working"] = false;
        } else if (!creep.memory["working"] && creep.carry.energy == creep.carryCapacity) {
            creep.memory["working"] = true;
        }

        if (creep.memory["working"]) {
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s => ([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(s.structureType)) && s.energy < s.energyCapacity
            });

            if (structure == undefined) {
                structure = creep.room.storage;
            }
            // room.storage is sometimes null too!
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { reusePath = 20, ignoreCreeps = true });
                }
            }
        } else {
            if (creep.memory["containerId"] == undefined) {
                RoleTruck.setContainer(creep);
            }
            let container = Game.getObjectById(creep.memory["containerId"]);
            
            if (container == undefined) {
                container = creep.room.storage;
            }

            if (container != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
    }

    private static setContainer(c: Creep) {
        var containers = Game.spawns["Spawn1"].memory["containers"];
        c.memory["containerId"] = containers[Math.round(Math.random())];
    }
}
