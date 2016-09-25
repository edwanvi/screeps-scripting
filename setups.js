// nail down Spawn1
var spawn = Game.spawns.Spawn1;
//signify we ran setup, mostly just in case
spawn.memory.ran_setup = true;

if (spawn.memory.setup_stage == null) {
	spawn.memory.setup_stage = 0;
	//get a list of energysources and print it
	energysources = spawn.room.find(FIND_SOURCES);
	console.out(energysources);
	console.out("Please place a flag adjacent to each energy source, on a tile a creep may reach.");
	if Game.flags.
	console.out("Setup phase 0 complete, terminating tick. Some phases remain.");
} else if (spawn.memory.setup_stage == 1) {
	//stage one = spawn miners
	console.out("Spawning an early phase miner.");
	var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
	console.out("Currently there are " + numberOfMiners + " miners.");
	numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
	// just doing move carry work until I can see what a reasonable limit is
	spawn.createCreep([MOVE, CARRY, WORK], undefined, {role: 'miner' + numberOfMiners + 1});
	if (numberOfMiners > spawn.room.find(FIND_SOURCES).length) {
		//we have spawned one miner/source. move on.
		spawn.memory.setup_stage++;
	}
}
