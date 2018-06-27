export class RoleMiner {
    public static run(creep: Creep) {
        let source = <Source> Game.getObjectById(creep.memory["sourceId"]);
        let container = source.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
        if (creep.pos == container.pos) {
            creep.harvest(source);
        } else {
            creep.moveTo(container);
        }
    }
}
