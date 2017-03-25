
module.exports= {
    role2: 'stationaryDumpToLink',

    addAsAdditionalSecondaryRoleTo: function(creepName, dest) {
        if (creepName) {
            if(Memory.creeps[creepName].role2 === undefined) {
                Memory.creeps[creepName].role2 = [];
            }
            Memory.creeps[creepName].role2.push(this.role2);
            Memory.creeps[creepName].stationaryDumpToLink_dest = dest;
        }
    },

    run: function (creep) {
        const destLink = Game.getObjectById(creep.memory.stationaryDumpToLink_dest);
        if(creep.carry.energy > 0.8 * creep.carryCapacity && destLink.energy < 770 ) {
            creep.transfer(destLink, RESOURCE_ENERGY);
            creep.say("dump2link");
            return true;
        } else {
            return false;
        }
    }
};