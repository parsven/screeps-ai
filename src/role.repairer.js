var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.repairing) {
            var structs = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits / object.hitsMax < 0.5
                });

                structs.sort((a,b) => a.hits - b.hits);

                if(structs.length > 0) {
                    if(creep.repair(structs[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleRepairer;