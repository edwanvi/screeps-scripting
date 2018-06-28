import { RoleTruck } from "./truck";

export class RoleInvader {
    public static run(creep: Creep) {
        if (Game.flags["invade"]) {
            let flag = Game.flags["invade"];
            if (creep.room.name != flag.pos.roomName) {
                if (creep.room.find(FIND_MY_SPAWNS).length > 0) {
                    creep.moveTo(flag, { reusePath: 100, ignoreCreeps: false });
                } else {
                    creep.moveTo(flag, { reusePath: 100, ignoreCreeps: true });
                }
            } else {
                let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    if ((creep.rangedAttack(target) == ERR_NOT_IN_RANGE || creep.rangedAttack(target) == ERR_NO_BODYPART) && creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    let targets = creep.room.find(FIND_HOSTILE_SPAWNS);
                    if (targets.length > 0) {
                        if ((creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE || creep.rangedAttack(targets[0]) == ERR_NO_BODYPART) && creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
            }
        } else {
            if (creep.room.name != creep.memory["homeRoom"]) {
                creep.moveTo(Game.spawns[creep.memory["homeSpawn"]], { reusePath: 100, ignoreCreeps: true });
            } else {
                RoleTruck.run(creep);
            }
        }
    }
}
