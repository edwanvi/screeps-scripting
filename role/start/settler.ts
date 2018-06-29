import { RoleBuilder } from "../maintain/builder";
import { RoleUpgrader } from "../maintain/upgrader";

export class RoleSettler {
    public static run(creep: Creep) {
        let flag = Game.flags["claimRoom"];
        if (flag != undefined && creep.memory["homeRoom"] == undefined) {
            if (flag.pos.roomName == creep.room.name) {
                if (creep.room.controller) {
                    if (!creep.room.controller.my) {
                        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    } else {
                        creep.memory["homeRoom"] = flag.pos.roomName;
                    }
                }
            } else {
                creep.moveTo(flag, { reusePath: 50 });
            }
        } else {
            if (flag.pos.roomName == creep.room.name) {
                RoleUpgrader.run(creep);
            } else {
                creep.moveTo(flag, { reusePath: 50 });
            }
        }
    }
}
