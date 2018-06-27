export class ExtendedSpawn {
    // order dictates spawning priority
    private static listOfRoles = ["truck", "upgrader", "builder", "defense", "janitor", "remoteminer", "harvester"];
    private static minCreeps: { [role: string]: number } = {
        "truck": 2,
        "builder": 4,
        "janitor": 2,
        "upgrader": 3,
        "harvester": 0
    };

    public static spawnCreepsAsNeeded(spawn: StructureSpawn) {
        let room = spawn.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        let census: { [role: string]: number } = {};
        for (let i = 0; i < ExtendedSpawn.listOfRoles.length; i++) {
            let role = ExtendedSpawn.listOfRoles[i];
            census[role] = _.sum(creepsInRoom, c => c.memory["role"] == role ? 1 : 0);
        }
        census["miner"] = _.sum(creepsInRoom, c => c.memory["role"] == "miner" ? 1 : 0);

        let energyMax = room.energyCapacityAvailable;
        let name = undefined;

        // no harvesters AND (no miners OR no trucks)
        // create backup
        if (census['harvester'] == 0 && census['truck'] == 0) {
            if (census['miner'] > 0 ||
                (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
                name = ExtendedSpawn.createTruck(spawn, 150);
            } else {
                // create solo harvester
                name = ExtendedSpawn.createCustom(spawn, room.energyAvailable, 'harvester', "hrv_");
            }
        } else {
            // normal operation no backup
            // do all sources have miners?
            let sources = room.find(FIND_SOURCES);
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory["role"] == "miner" && c.memory["sourceId"] == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: function(s: AnyStructure) {
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
        }

        if (name == undefined) {
            // somehow we have enough in the way of energy gathering
            for (let i = 0; i < ExtendedSpawn.listOfRoles.length; i++) {
                let role = ExtendedSpawn.listOfRoles[i];
                if (census[role] < ExtendedSpawn.minCreeps[role]) {
                    if (role == "truck") {
                        name = ExtendedSpawn.createTruck(spawn, 150);
                    } else {
                        name = ExtendedSpawn.createCustom(spawn, energyMax, role, role.replace(/[aeiouy]/gi, ""));
                    }
                    break;
                }
            }
        }

        if (name != undefined && _.isString(name)) {
            console.log(spawn.name + " spawned new creep " + name);
        }
    }

    private static createTruck(spawn: StructureSpawn, energy: number) {
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
        let spawnCode = spawn.spawnCreep(body, "trk_" + randEnd, { memory: { role: 'truck', working: false } });
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
        let spawnCode = spawn.spawnCreep(body, stringPart + "_" + randEnd, { memory: { role: roleName, working: false } });
        return spawnCode == OK ? stringPart + "_" + randEnd : spawnCode;
    }
}
