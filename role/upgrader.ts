import { ExUt } from "../extrautils";

export class RoleUpgrader {
    public static run(creep: Creep) {
        if (creep.memory["working"] && creep.carry.energy == 0) {
            // switch state
            creep.memory["working"] = false;
        } else if (!creep.memory["working"] && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory["working"] = true;
        }

        if (creep.memory["working"]) {
            if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { reusePath: 20 });
            }
        } else {
            if (creep.memory["energysource"] == null) {
                ExUt.newSource(creep);
            }
            var source = ExUt.getSources(Game.spawns["Spawn1"])[creep.memory["energysource"]];
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source, { reusePath: 20 });
            }
        }
    }
}

