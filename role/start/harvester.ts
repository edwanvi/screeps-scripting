import { ExUt } from "extrautils";
import { RoleUpgrader } from "../maintain/upgrader";

export class RoleHarvester {
    public static run(creep: Creep) {
        if (Game.rooms[creep.memory["homeRoom"]].memory["pathsExist"] == null || !Game.rooms[creep.memory["homeRoom"]].memory["pathsExist"]) {
            RoleHarvester.pathsInit(Game.rooms[creep.memory["homeRoom"]], Game.spawns[creep.memory["homeSpawn"]].pos);
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
                        return !s.room.memory["towerWorking"];
                    } else if (s.structureType == STRUCTURE_STORAGE) {
                        return s.store[RESOURCE_ENERGY] < Math.pow(10, 4);
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
                RoleUpgrader.run(creep);
            }
        } else {
            let room = Game.rooms[creep.memory["homeRoom"]];
            let sources = room.find(FIND_SOURCES);
            if (creep.harvest(sources[creep.memory["energysource"]]) == ERR_NOT_IN_RANGE) {
                if (creep.moveByPath(room.memory["source" + creep.memory["energysource"] + "path"]) == ERR_NOT_FOUND) {
                    var path = Room.deserializePath(room.memory["source" + creep.memory["energysource"] + "path"]);
                    var first_point = path[0];
                    creep.moveTo(first_point.x, first_point.y);
                }
            }
        }
    }

    private static pathsInit(room: Room, start: RoomPosition) {
        var sources = room.find(FIND_SOURCES);
        room.memory["source0path"] = Room.serializePath(start.findPathTo(sources[0].pos, {ignoreCreeps: true}));
        room.memory["source1path"] = Room.serializePath(start.findPathTo(sources[1].pos, {ignoreCreeps: true}));
        console.log("Saved paths to room " + room.name + " memory");
        room.memory["pathsExist"] = true;
    }
}
