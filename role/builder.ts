var roleUpgrader = require('role.upgrader');
var extrautils = require("extrautils");

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

        if (creep.memory.energysource == null) {
            extrautils.newsource.run(creep);
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory["working"]) {
            // find closest constructionSite
            var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (sites.length > 0) {
                if (creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sites[0], { reusePath: 20 });
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source, { reusePath: 20 });
            }
        }
    }
}
