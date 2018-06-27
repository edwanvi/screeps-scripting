const cheapAllPurpose = [WORK, CARRY, MOVE];
const tier2Creep = [WORK, WORK, CARRY, MOVE];
const topTier = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];

export function getWorkerSpecs(room: Room) {
    if (room.energyCapacityAvailable <= 300) {
        return cheapAllPurpose;
    } else if (room.energyCapacityAvailable <= 550) {
        return tier2Creep;
    } else {
        return topTier;
    }
}

export const attackerSpecs = [RANGED_ATTACK, MOVE, MOVE, CARRY, WORK];
export const cheapAttackerSpecs = [TOUGH,MOVE,WORK,CARRY,ATTACK];
