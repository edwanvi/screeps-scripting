import { RoleJanitor } from "role/janitor";
import { ExUt } from "../extrautils";

export class RoleHarvester {
    public static run(creep: Creep) {
        if (Game.spawns["Spawn1"].memory["pathsExist"] == null || !Game.spawns["Spawn1"].memory["pathsExist"]) {
            RoleHarvester.pathsInit(Game.spawns["Spawn1"]);
        }
        if (creep.memory["energysource"] == null) {
            ExUt.newSource(creep);
        }
        if (creep.memory["working"] && creep.carry.energy == 0) {
            creep.memory["working"] = false;
        } else if (!creep.memory["working"] && creep.carry.energy >= creep.carryCapacity) {
            creep.memory["working"] = true;
        }
        if (creep.memory["working"]) {
            // try to transfer energy, if the spawn is not in range
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    if (s.structureType == STRUCTURE_TOWER) {
                        return s.energy / s.energyCapacity <= 0.5;
                    } else {
                        return (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity;
                    }
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { reusePath: 20 });
                }
            } else {
                RoleJanitor.run(creep);
            }
        } else {
            var sources = ExUt.getSources(Game.spawns["Spawn1"]);
            if (creep.harvest(sources[creep.memory["energysource"]]) == ERR_NOT_IN_RANGE) {
                if (creep.moveByPath(Game.spawns["Spawn1"].memory["source" + creep.memory["energysource"] + "path"]) == ERR_NOT_FOUND) {
                    var path = Room.deserializePath(Game.spawns["Spawn1"].memory["source" + creep.memory["energysource"] + "path"]);
                    var first_point = path[0];
                    creep.moveTo(first_point.x, first_point.y);
                }
            }
        }
    }

    private static pathsInit(spawn: StructureSpawn) {
        var sources = ExUt.getSources(spawn);
        spawn.memory["source0path"] = Room.serializePath(spawn.pos.findPathTo(sources[0].pos, {ignoreCreeps: true}));
        spawn.memory["source1path"] = Room.serializePath(spawn.pos.findPathTo(sources[1].pos, {ignoreCreeps: true}));
        console.log("Saved paths to spawn memory");
        spawn.memory["pathsExist"] = true;
    }

    public static newSource(creep: Creep) {
        if (Math.random() > 0.5) {
            creep.memory.energysource = 1;
        } else {
            creep.memory.energysource = 0;
        }
        console.log(creep + ' will harvest source ' + creep.memory.energysource + ' for role ' + creep.memory.role);
    }
}
