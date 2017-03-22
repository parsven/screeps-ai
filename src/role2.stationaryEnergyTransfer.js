
module.exports= {
    role2: 'stationaryEnergyTransfer',


    addAsAdditionalSecondaryRoleTo: function(creepName, source, dest) {
        if (creepName) {
            Memory.creeps[creepName].role2.push(this.role2);
            Memory.creeps[creepName].stationaryEnergyTransfer_source = source;
            Memory.creeps[creepName].stationaryEnergyTransfer_dest = dest;
        }
    },

    run: function (creep) {
        const sourceStructure = Game.getObjectById(creep.memory.stationaryEnergyTransfer_source);
        console.log("sourceStructure.energy" + sourceStructure.energy);
        if(!creep.pos.isNearTo(sourceStructure)) {
            return false;
        }

        if(sourceStructure.energy > 0 && creep.carry.energy < 0.2 * creep.carryCapacity) {
            creep.say("a");
            sourceStructure.transferEnergy(creep);
            return true;
        }

        const destStructure = Game.getObjectById(creep.memory.stationaryEnergyTransfer_dest);
        if(creep.carry.energy > 0.2 * creep.carryCapacity && destStructure.store.energy < 1951) {
            creep.transfer(destStructure, RESOURCE_ENERGY);
            creep.say("b");
            return true;
        }
        creep.say("c");
        return false;

    }
};