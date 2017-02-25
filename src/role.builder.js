const _ = require('lodash');


const roleBuilder = {

    role: 'builder',

    factory: function (spawn, body, sourceId, harvestFlagName, roleName) {
        const name = roleName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                sourceId: sourceId,
                harvestFlagName: harvestFlagName,
            })
        } else {
            return undefined
        }
    },


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
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
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
            source = Game.getObjectById(creep.memory.sourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                const flag = Game.flags[creep.memory.harvestFlagName];
                res = creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;