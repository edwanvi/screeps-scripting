import { RoleHarvester } from "role/harvester";

export class RoleDefender {

    private static hostiles: Creep[];
    public static init(room: Room) {
        RoleDefender.hostiles = room.find(FIND_HOSTILE_CREEPS);
    }

    public static run(creep: Creep) {
        if (RoleDefender.hostiles.length > 0) {
            if (creep.attack(RoleDefender.hostiles[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(RoleDefender.hostiles[0]);
            }
        } else {
            RoleHarvester.run(creep);
        }
    }

    public static getHostiles() {
        return RoleDefender.hostiles;
    }
}
