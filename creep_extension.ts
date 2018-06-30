import { ExUt } from "extrautils";

export class ExtendedCreep {
    public static getEnergy(creep: Creep, useContainers: boolean, useSources: boolean) {
        let container;
        // if the Creep should look for containers
        if (useContainers) {
            // find closest container
            if (creep.room.storage != undefined) {
                container = creep.room.storage.store[RESOURCE_ENERGY] >= (creep.carryCapacity - creep.carry[RESOURCE_ENERGY]) ? creep.room.storage : undefined;
            }
            if (container == undefined) {
                if (creep.memory["energysource"] == undefined) {
                    container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => (s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0
                    });
                } else {
                    let source = creep.room.find(FIND_SOURCES)[creep.memory["energysource"]];
                    container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: function(s: AnyStructure) {
                            return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
                        }
                    })[0];
                }
            }
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                }
            }
        }
        // if no container was found and the Creep should look for Sources
        // TODO: Respect source in memory
        if (container == undefined && useSources) {
            // find memory source
            if (creep.memory["energysource"] == null) {
                ExUt.newSource(creep);
            }

            var source = creep.room.find(FIND_SOURCES)[creep.memory["energysource"]];

            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards it
                creep.moveTo(source, { reusePath: 50 });
            }
        }
    }
}
