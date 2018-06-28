import { RoleTruck } from "./truck";
import { RoleUpgrader } from "./upgrader";

export class RemoteMiner {
    public static run(creep: Creep) {
        // this role goes to a flag, mines around it, and deposits stuff at spawn.
        if (creep.memory["working"] && creep.carry.energy == 0) {
            // switch state
            creep.memory["working"] = false;
        }
        // if creep is harvesting energy but is full
        else if (!creep.memory["working"] && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory["working"] = true;
        }

        // if we need to harvest energy
        if (!creep.memory["working"]) {
            if (creep.room.name === Game.flags["remoteMining"].pos.roomName) {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                creep.moveTo(Game.flags["remoteMining"], { reusePath: 50 });
            }
        } else {
            // take energy back to spawn, we're full!
            if (creep.room.name == creep.memory["homeRoom"]) {
                var structure;
                if (creep.room.storage != undefined) {
                    structure = creep.room.storage;
                } else {
                    structure = creep.room.find(FIND_MY_STRUCTURES, {
                        filter: function (s) {
                            if (s.structureType == STRUCTURE_TOWER) {
                                return !s.room.memory["towerWorking"];
                            }
                            return (s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN) &&
                                s.energy < s.energyCapacity;
                        }
                    })[0];
                }
                // room.storage is sometimes null too!
                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure, { reusePath: 20 });
                    }
                } else {
                    // work that controller bby
                    RoleUpgrader.run(creep);
                }
            } else {
                creep.moveTo(new RoomPosition(25, 25, creep.memory["homeRoom"]));
            }
        }
    }
};
