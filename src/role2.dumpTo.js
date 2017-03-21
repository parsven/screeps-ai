/**
 * Created by parsvensson on 2017-03-21.
 */

module.exports= {
    role2: 'dumpTo',

    addAsSecondaryRoleTo(creepName, dest) {
        if (creepName) {
            Memory.creeps[creepName].role2 = this.role2;
            Memory.creeps[creepName].dumpTo_dest = dest;
        }
    },

    run: function (creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            const dest = Game.getObjectById(creep.memory.dumpTo_dest);
            if (dest.energy < dest.energyCapacity) {
                if (ERR_NOT_IN_RANGE == creep.transfer(dest, RESOURCE_ENERGY)) {
                    creep.moveTo(dest);
                }
                return true;
            } else {
                return false;
            }
        }
    }
}