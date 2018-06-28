import { ExUt } from "../extrautils";
import { ExtendedCreep } from "creep_extension";

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
            ExtendedCreep.getEnergy(creep, true, true);
        }
    }
}

