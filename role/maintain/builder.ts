import { RoleUpgrader } from "role/maintain/upgrader";
import { ExtendedCreep } from "creep_extension";
import { ExtraUtils } from "extrautils";

export class RoleBuilder {
    public static run(creep: Creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory["working"] && creep.carry.energy == 0) {
            // switch state
            creep.memory["working"] = false;
        }
        // if creep is harvesting energy but is full
        else if (!creep.memory["working"] && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory["working"] = true;
        }

        if (creep.memory["energysource"] == null) {
            ExtraUtils.newSource(creep);
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory["working"]) {
            var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (sites.length > 0) {
                if (creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sites[0], {reusePath: 20});
                }
            } else {
                // go upgrading the controller
                RoleUpgrader.run(creep);
            }
        } else {
            ExtendedCreep.getEnergy(creep, true, true);
        }
    }
}