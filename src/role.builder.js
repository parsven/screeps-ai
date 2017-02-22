var _ = require('lodash');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                targets = _.sortBy(targets, ['structureType']);
                if(creep.build(targets[targets.length -1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length -1], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var dest = Game.flags['Fallback'];
                creep.moveTo(dest);
            }        
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            source = sources[1];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags['BuildSource'], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;