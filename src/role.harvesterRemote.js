const roleHarvesterRemote = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.unloading && creep.carry.energy == 0) {
            creep.memory.unloading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('🚧give to the base!');
        }


        if (creep.memory.unloading) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if( targets.length == 0) {
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
                const dest = new RoomPosition(1, 44, 'E26S63');
                creep.moveTo(dest);
            }
        } else {
            const room = Game.rooms['E25S63'];
            if (room) {
               // const sources = room.find(FIND_SOURCES);
               // source = sources[0];
                source = Game.getObjectById('58af8d5fdb3b7b23072eed6f');
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                const dest = new RoomPosition(47, 44, 'E25S63');
                creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHarvesterRemote;