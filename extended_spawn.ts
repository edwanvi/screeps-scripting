export class ExtendedSpawn {
    // order dictates spawning priority
    private static listOfRoles = ["truck", "upgrader", "builder", "remoteminer", "janitor", "defense", "harvester"];
    private static minCreeps: { [role: string]: number } = {
        "truck": 2,
        "builder": 4,
        "janitor": 2,
        "upgrader": 3,
        "remoteminer": 1,
        "invader": 6,
        "harvester": 0
    };

    public static spawnCreepsAsNeeded(spawn: StructureSpawn) {
        let room = spawn.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        let census: { [role: string]: number } = {};
        for (let i = 0; i < ExtendedSpawn.listOfRoles.length; i++) {
            let role = ExtendedSpawn.listOfRoles[i];
            if (!(role == "remoteminer")) {
                census[role] = _.sum(creepsInRoom, c => c.memory["role"] == role ? 1 : 0);
            } else {
                census[role] = _.sum(Game.creeps, c => c.memory["role"] == role ? 1 : 0);
            }
        }
        census["invader"] = _.sum(Game.creeps, c => c.memory["role"] == "invader" ? 1 : 0)
        census["miner"] = _.sum(creepsInRoom, c => c.memory["role"] == "miner" ? 1 : 0);

        let energyMax = room.energyCapacityAvailable;
        let name = undefined;

        // no harvesters AND (no miners OR no trucks)
        // create backup
        if (census['harvester'] == 0 && census['truck'] == 0) {
            if (census['miner'] > 0 ||
                (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
                name = ExtendedSpawn.createTruck(spawn, 150, "");
            } else {
                // create solo harvester
                name = ExtendedSpawn.createHarvester(spawn, room.energyAvailable);
            }
        } else {
            // normal operation no backup
            // do all sources have miners?
            let sources = room.find(FIND_SOURCES);
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory["role"] == "miner" && c.memory["sourceId"] == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: function (s: AnyStructure) {
                            return s.structureType == STRUCTURE_CONTAINER;
                        }
                    });
                    if (containers.length > 0) {
                        // spawn a miner
                        name = ExtendedSpawn.createMiner(spawn, source.id);
                        break;
                    }
                }
            }
            let containers = room.find(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.structureType == STRUCTURE_CONTAINER;
                }
            });
            for (let container of containers) {
                if (!_.some(creepsInRoom, c => c.memory["role"] == "truck" && c.memory["containerId"] == container.id)) {
                    name = ExtendedSpawn.createTruck(spawn, 350, container.id);
                    break;
                }
            }
        }

        if (name == undefined) {
            // somehow we have enough in the way of energy gathering
            for (let i = 0; i < ExtendedSpawn.listOfRoles.length; i++) {
                let role = ExtendedSpawn.listOfRoles[i];
                if (census[role] < ExtendedSpawn.minCreeps[role]) {
                    if (role == "truck") {
                        name = ExtendedSpawn.createTruck(spawn, 150, "");
                    } else {
                        // console.log(role);
                        name = ExtendedSpawn.createCustom(spawn, Math.floor(energyMax / 2), role, role.replace(/[aeiouy]/gi, ""));
                    }
                    break;
                }
            }
        }

        // are we invading with this spawn?
        if (name == undefined && Game.flags["invade"] != undefined && Game.flags["invade"].memory["spawn"] == spawn.name) {
            if (census["invader"] < ExtendedSpawn.minCreeps["invader"]) {
                name = ExtendedSpawn.createAttacker(spawn, Math.floor(energyMax / 2));
            }
        }

        if (name != undefined && _.isString(name)) {
            console.log(spawn.name + " spawned new creep " + name);
        }
    }

    private static createAttacker(spawn: StructureSpawn, energy: number) {
        var numberOfParts = Math.floor(energy / 330);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body: BodyPartConstant[] = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(ATTACK);
            body.push(RANGED_ATTACK);
            body.push(CARRY);
            body.push(MOVE);
        }
        let creepName = "attck_" + _.random(0, 100);
        let spawnCode = spawn.spawnCreep(body, creepName, { memory: { role: "invader", homeRoom: spawn.room.name, homeSpawn: spawn.name } });
        return spawnCode == OK ? creepName : spawnCode;
    }

    private static createTruck(spawn: StructureSpawn, energy: number, sourceId: string) {
        // CARRY = MOVE * 2, limited such that MOVE + CARRY <= 50
        var numberOfParts = Math.floor(energy / 150);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body: BodyPartConstant[] = [];

        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        let randEnd = _.random(1, 100);
        let spawnCode = spawn.spawnCreep(body, "trk_" + randEnd, { memory: { role: 'truck', working: false, containerId: sourceId, homeSpawn: spawn.name } });
        if (spawnCode == OK) {
            return "trk_" + randEnd;
        } else {
            return spawnCode;
        }
    }

    private static createMiner(spawn: StructureSpawn, id: string) {
        let creepName = "mnr_" + _.random(1, 100);
        let spawnCode = spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], creepName, { memory: { role: 'miner', sourceId: id } });
        return spawnCode == OK ? creepName : spawnCode;
    }

    private static createHarvester(spawn: StructureSpawn, energy: number) {
        // use similar to createCustom
        var numberOfParts = Math.floor(energy / 200);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body: BodyPartConstant[] = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        let randEnd = _.random(1, 100);
        let spawnCode = spawn.spawnCreep(body, "hrvstr_" + randEnd, { memory: { role: "harvester", working: false, homeRoom: spawn.room.name, homeSpawn: spawn.name } });
        return spawnCode == OK ? "hrvstr_" + randEnd : spawnCode;
    }

    private static createCustom(spawn: StructureSpawn, energy: number, roleName: string, stringPart: string) {
        // balanced and large
        var numberOfParts = Math.floor(energy / 200);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body: BodyPartConstant[] = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        let randEnd = _.random(1, 100);
        let spawnCode = spawn.spawnCreep(body, stringPart + "_" + randEnd, { memory: { role: roleName, working: false, homeRoom: spawn.room.name } });
        return spawnCode == OK ? stringPart + "_" + randEnd : spawnCode;
    }
}
