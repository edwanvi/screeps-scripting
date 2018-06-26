import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "role/harvester";
import { RoleUpgrader } from "role/upgrader";
import { RoleBuilder } from "role/builder";
import { RoleJanitor } from "role/janitor";
import { RemoteMiner } from "role/remoteminer";
import { RoleDefender } from "role/defender";
import * as specs from "specs";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(function () {
    var tower = <StructureTower> Game.getObjectById(Game.spawns["Spawn1"].memory["towerId"]);
    if (tower) {
        var damagedStructures = tower.room.find(FIND_STRUCTURES, {
            filter: function (structure: Structure) {
                return structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_WALL;
            }
        });
        if (tower.energy / tower.energyCapacity > 0.5 && (damagedStructures.length > 0)) {
            damagedStructures.sort((a, b) => a.hits - b.hits);
            tower.repair(damagedStructures[0]);
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
        default:
            // TODO: Make a role-less creep
            RoleUpgrader.run(creep);
        }
    }

    // maxiumum populations
    var maxiumumNumberOfHarvesters = 5;
    var maxiumumNumberOfUpgraders = 3;
    var maxiumumNumberOfBuilders = 4;
    var maxiumumNumberOfJanitors = 2;
    var maxiumumNumberOfDefenders = 1;
    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory["role"] == 'harvester' ? 1 : 0);
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory["role"] == 'upgrader' ? 1 : 0);
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory["role"] == 'builder' ? 1 : 0);
    var numberOfJanitors = _.sum(Game.creeps, (c) => c.memory["role"] == 'janitor' ? 1 : 0);
    var numberOfDefenders = _.sum(Game.creeps, (c) => c.memory["role"] == 'defense' ? 1 : 0);

    var newName: ScreepsReturnCode;
    var randEnd = _.random(1, 100);
    var stringPart: string;
    var room = Game.spawns["Spawn1"].room;

    if (numberOfHarvesters < maxiumumNumberOfHarvesters) {
        newName = Game.spawns["Spawn1"].spawnCreep(specs.getWorkerSpecs(room), "harv_" + randEnd,
            { memory: { role: 'harvester', working: false } });
        stringPart = "harv_";
    } else if (numberOfUpgraders < maxiumumNumberOfUpgraders) {
        newName = Game.spawns["Spawn1"].spawnCreep(specs.getWorkerSpecs(room), "up_" + randEnd,
            { memory: { role: 'upgrader', working: false } });
        stringPart = "up_";
    } else if (numberOfBuilders < maxiumumNumberOfBuilders) {
        newName = Game.spawns["Spawn1"].spawnCreep(specs.getWorkerSpecs(room), "build_" + randEnd,
            { memory: { role: 'builder', working: false } });
        stringPart = "build_";
    } else if (numberOfJanitors < maxiumumNumberOfJanitors) {
        newName = Game.spawns["Spawn1"].spawnCreep(specs.getWorkerSpecs(room), "jan_" + randEnd,
            { memory: { role: 'janitor', working: false } });
        stringPart = "jan_";
    } else if (numberOfDefenders < maxiumumNumberOfDefenders && Game.spawns["Spawn1"].room.find(FIND_HOSTILE_CREEPS).length > 0) {
        newName = Game.spawns["Spawn1"].spawnCreep([TOUGH, TOUGH, MOVE, WORK, CARRY, ATTACK], "def_" + randEnd,
            { memory: { role: 'defense' }});
        stringPart = "def_";
    } else {
        newName = -1;
        stringPart = "";
        randEnd = 0;
    }
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(newName < 0) && newName != undefined) {
        console.log("Spawned new creep: " + stringPart + randEnd);
    }
});
