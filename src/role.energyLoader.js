
const roleMineralHauler = require('./role.mineralhauler');

var roleEnergyLoader = {

    role: 'energyLoader',

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.unloading && creep.carry.energy == 0) {
         //   console.log('apa3');
            creep.memory.unloading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('🚧give to the base!');
        //    console.log('apa2');
        }

        let targets;
        if (creep.memory.unloading) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            const container = Game.getObjectById(creep.memory.containerId);
            const currentContainerLevel = container.store[RESOURCE_ENERGY];
            if(targets.length == 0 && creep.memory.containerLevel &&  currentContainerLevel > creep.memory.containerLevel) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
            }

            if(targets.length == 0 && creep.memory.containerLevel &&  currentContainerLevel > creep.memory.containerLevel) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE
                });
            }

            if (targets.length > 0) {
                const target = creep.pos.findClosestByRange(targets);

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    const reuserFactor = Math.floor(Math.random() * (5 - 4 + 1)) + 4;
                    creep.moveTo(target, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {

                if(roleMineralHauler.mineralContainerInRoom) {
                    creep.memory.role = roleMineralHauler.role;
                    creep.memory.oldRole = this.role;
                } else {
                    var dest = Game.flags['Fallback2'];
                    creep.moveTo(dest);
                }
            }
        } else {
            const source = Game.getObjectById(creep.memory.containerId);
            const res = creep.withdraw(source, RESOURCE_ENERGY);
            if (res== ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
  //              console.log("qq:" + res)
            }
        }
    }
};

module.exports = roleEnergyLoader;