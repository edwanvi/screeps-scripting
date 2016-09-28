// import modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleJanitor = require('role.janitor');
const roleremoteminer = require('role.remoteminer');
const specs = require('specs');

module.exports.loop = function () {
  // check for memory entries of dead creeps by iterating over Memory.creeps
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }
  // man the tower
  var tower = Game.getObjectById('57eb00a1ec14fa4651855289');
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
      && structure.structureType != STRUCTURE_ROAD
      && structure.structureType != STRUCTURE_WALL
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }

  // for every creep name in Game.creeps
  // IDEA: Change this to a switch
  for (let name in Game.creeps) {
    // get the creep object
    var creep = Game.creeps[name];

    // if creep is harvester, call harvester script

    switch (creep.memory.role) {
      case 'harvester':
        roleHarvester.run(creep);
        break;
      case 'upgrader':
        roleUpgrader.run(creep);
        break;
      case 'builder':
        roleBuilder.run(creep);
        break;
      case 'janitor':
        roleJanitor.run(creep);
        break;
      case 'remoteminer':
        roleremoteminer.run(creep);
        break;
      default:
        // TODO: Make a role-less creep
    }
  }

  // maxiumum populations
  const maxiumumNumberOfHarvesters = 3;
  const maxiumumNumberOfUpgraders = 3;
  const maxiumumNumberOfBuilders = 2;
  const maxiumumNumberOfJanitors = 2;
  const maxiumumNumberOfRemotes = 1;
  // count the number of creeps alive for each role
  // _.sum will count the number of properties in Game.creeps filtered by the
  //  arrow function, which checks for the creep being a harvester/janitor/etc
  var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
  var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
  var numberOfJanitors = _.sum(Game.creeps, (c) => c.memory.role == 'janitor');
  var numberOfRemotes = _.sum(Game.creeps, (c) => c.memory.role == 'remoteminer');

  global.numberOfCreeps = numberOfRemotes + numberOfJanitors + numberOfBuilders + numberOfUpgraders + numberOfHarvesters;

  var name = undefined;

  // if not enough harvesters
  if (numberOfHarvesters < maxiumumNumberOfHarvesters) {
    // try to spawn one
    name = Game.spawns.Spawn1.createCreep(specs.harvesterSpecs, undefined,
      {role: 'harvester', working: false});
  }
  // if not enough upgraders
  else if (numberOfUpgraders < maxiumumNumberOfUpgraders) {
    // try to spawn one
    name = Game.spawns.Spawn1.createCreep(specs.upgraderSpecs, undefined,
      {role: 'upgrader', working: false});
  }
  // if not enough builders
  else if (numberOfBuilders < maxiumumNumberOfBuilders) {
    // try to spawn one
    name = Game.spawns.Spawn1.createCreep(specs.builderSpecs, undefined,
      {role: 'builder', working: false});
  }
  else if (numberOfJanitors < maxiumumNumberOfJanitors) {
    // try to spawn a janitor
    name = Game.spawns.Spawn1.createCreep(specs.janitorSpecs, undefined,
      {role: 'janitor', working: false});
  } else if (numberOfRemotes < maxiumumNumberOfRemotes) {
    name = Game.spawns.Spawn1.createCreep(specs.harvesterSpecs, undefined,
      {role: 'remoteminer', working: false});
  }
  // print name to console if spawning was a success
  // name > 0 would not work since string > 0 returns false
  if (!(name < 0) && name != undefined) {
    console.log("Spawned new creep: " + name);
  }
};
