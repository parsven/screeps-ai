var roleHarvester = {

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
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length == 0) {
                targets = [Game.getObjectById('58af4af675cde625e5e03868')];
            }
            if (targets.length > 0) {
                var target = creep.pos.findClosestByRange(targets);

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    var reuserFactor = Math.floor(Math.random() * (5 - 4 + 1)) + 4;
                    creep.moveTo(target, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var dest = Game.flags['Fallback'];
                creep.moveTo(dest);
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHarvester;