// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleJanitor = require('role.janitor');
var specs = require('specs');

module.exports.loop = function () {
  // check for memory entries of dead creeps by iterating over Memory.creeps
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  var tower = Game.getObjectById('57af8439d7470970440fa983');
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
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
  for (let name in Game.creeps) {
    // get the creep object
    var creep = Game.creeps[name];

    // if creep is harvester, call harvester script
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    // if creep is upgrader, call upgrader script
    else if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    // if creep is builder, call builder script
    else if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    // if creep is janitor, call janitor script
    else if (creep.memory.role == 'janitor') {
      roleJanitor.run(creep);
    }
  }

  // setup some minimum numbers for different roles
  var minimumNumberOfHarvesters = 10;
  var minimumNumberOfUpgraders = 3;
  var minimumNumberOfBuilders = 5;
  var minimumNumberOfJanitors = 1;

  // count the number of creeps alive for each role
  // _.sum will count the number of properties in Game.creeps filtered by the
  //  arrow function, which checks for the creep being a harvester
  var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
  var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
  var numberOfJanitors = _.sum(Game.creeps, (c) => c.memory.role == 'janitor');

  var name = undefined;

  // if not enough harvesters
  if (numberOfHarvesters < minimumNumberOfHarvesters) {
    // try to spawn one
    name = Game.spawns.Spawn1.createCreep(specs.harvesterSpecs, undefined,
      {role: 'harvester', working: false});
  }
  // if not enough upgraders
  else if (numberOfUpgraders < minimumNumberOfUpgraders) {
    // try to spawn one
    name = Game.spawns.Spawn1.createCreep(specs.upgraderSpecs, undefined,
      {role: 'upgrader', working: false});
  }
  // if not enough builders
  else if (numberOfBuilders < minimumNumberOfBuilders) {
    // try to spawn one
    name = Game.spawns.Spawn1.createCreep(specs.builderSpecs, undefined,
      {role: 'builder', working: false});
  }
  else if (numberOfJanitors < minimumNumberOfJanitors) {
    // try to spawn a janitor
    name = Game.spawns.Spawn1.createCreep(specs.janitorSpecs, undefined,
      {role: 'janitor', working: false});
  }
  else {
    // else try to spawn a builder
    name = Game.spawns.Spawn1.createCreep(specs.builderSpecs, undefined,
      {role: 'builder', working: false});
  }

  // print name to console if spawning was a success
  // name > 0 would not work since string > 0 returns false
  if (!(name < 0)) {
    console.log("Spawned new creep: " + name);
  }
};
