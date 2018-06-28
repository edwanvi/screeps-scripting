import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "role/harvester";
import { RoleUpgrader } from "role/upgrader";
import { RoleBuilder } from "role/builder";
import { RoleJanitor } from "role/janitor";
import { RemoteMiner } from "role/remoteminer";
import { RoleDefender } from "role/defender";
import { ExtendedSpawn } from "extended_spawn";
import { RoleTruck } from "role/truck";
import { RoleMiner } from "role/miner";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(function () {
    var tower = <StructureTower>Game.getObjectById(Game.spawns["Spawn1"].memory["towerId"]);
    if (tower) {
        if (tower.room.memory["towerWorking"] && tower.energy == 0) {
            tower.room.memory["towerWorking"] = false;
        } else if (!tower.room.memory["towerWorking"] && tower.energy == tower.energyCapacity) {
            tower.room.memory["towerWorking"] = true;
        }

        if (tower.room.memory["towerWorking"]) {
            var damagedStructures = tower.room.find(FIND_STRUCTURES, {
                filter: function (structure: Structure) {
                    return structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_WALL;
                }
            });
            if (damagedStructures.length > 0) {
                damagedStructures.sort((a, b) => a.hits - b.hits);
                tower.repair(damagedStructures[0]);
            }
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    PathFinder.use(true);
    // check for memory entries of dead creeps by iterating over Memory.creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];
        switch (creep.memory["role"]) {
            case 'harvester':
                RoleHarvester.run(creep);
                break;
            case 'upgrader':
                RoleUpgrader.run(creep);
                break;
            case 'builder':
                RoleBuilder.run(creep);
                break;
            case 'janitor':
                RoleJanitor.run(creep);
                break;
            case 'remoteminer':
                RemoteMiner.run(creep);
                break;
            case 'defense':
                if (RoleDefender.getHostiles() == undefined) {
                    RoleDefender.init(Game.spawns["Spawn1"].room);
                }
                RoleDefender.run(creep);
                break;
            case 'truck':
                RoleTruck.run(creep);
                break;
            case 'miner':
                RoleMiner.run(creep);
                break;
            default:
                // TODO: Make a role-less creep
                RoleUpgrader.run(creep);
        }
    }
    ExtendedSpawn.spawnCreepsAsNeeded(Game.spawns["Spawn1"]);
});
