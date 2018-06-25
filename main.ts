import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "role/harvester";
import { RoleUpgrader } from "role/upgrader";
import { RoleBuilder } from "role/builder";
import { RoleJanitor } from "role/janitor";
import { RemoteMiner } from "role/remoteminer";
import * as specs from "specs";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(function () {
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
  // count the number of creeps alive for each role
  // _.sum will count the number of properties in Game.creeps filtered by the
  //  arrow function, which checks for the creep being a harvester
  var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory["role"] == 'harvester' ? 1 : 0);
  var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory["role"] == 'upgrader' ? 1 : 0);
  var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory["role"] == 'builder' ? 1 : 0);
  var numberOfJanitors = _.sum(Game.creeps, (c) => c.memory["role"] == 'janitor' ? 1 : 0);

  var newName: ScreepsReturnCode;
  var randEnd = _.random(1, 100);
  var stringPart: string;

  // if not enough harvesters
  if (numberOfHarvesters < maxiumumNumberOfHarvesters) {
    // try to spawn one
    newName = Game.spawns["Spawn1"].spawnCreep(specs.harvesterSpecs, "harv_" + randEnd,
      { memory: { role: 'harvester', working: false } });
    stringPart = "harv_";
  }
  // if not enough upgraders
  else if (numberOfUpgraders < maxiumumNumberOfUpgraders) {
    // try to spawn one
    newName = Game.spawns["Spawn1"].spawnCreep(specs.upgraderSpecs, "up_" + randEnd,
      { memory: { role: 'upgrader', working: false } });
    stringPart = "up_";
  }
  // if not enough builders
  else if (numberOfBuilders < maxiumumNumberOfBuilders) {
    // try to spawn one
    newName = Game.spawns["Spawn1"].spawnCreep(specs.builderSpecs, "build_" + randEnd,
      { memory: { role: 'builder', working: false } });
    stringPart = "build_";
  }
  else if (numberOfJanitors < maxiumumNumberOfJanitors) {
    // try to spawn a janitor
    newName = Game.spawns["Spawn1"].spawnCreep(specs.janitorSpecs, "jan_" + randEnd,
      { memory: { role: 'janitor', working: false } });
    stringPart = "jan_";
  } else {
    // console.log("No creep spawned");
    newName = Game.spawns["Spawn1"].spawnCreep(specs.upgraderSpecs, "up_" + randEnd,
      { memory: { role: 'upgrader', working: false } });
    stringPart = "up_";
  }
  // print name to console if spawning was a success
  // name > 0 would not work since string > 0 returns false
  if (!(newName < 0) && newName != undefined) {
    console.log("Spawned new creep: " + stringPart + randEnd);
  }
});
