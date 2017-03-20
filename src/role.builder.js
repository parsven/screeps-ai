const _ = require('lodash');


const roleBuilder = {

    role: 'builder',

    factory: function (spawn, body, sourceId, harvestFlagName, taskName) {
        const name = taskName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                sourceId: sourceId,
                harvestFlagName: harvestFlagName,
                spawnRoom: spawn.room.name,
                taskName: taskName
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
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {

                    const reuserFactor = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
                    creep.moveTo(targets[0], {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var dest = Game.flags['Fallback'];
                creep.moveTo(dest);
            }        
        } else {
            const energyResource = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0];
            if (energyResource) {
                if (OK == creep.pickup(energyResource)) {
                    return;
                }
            }
            source = Game.getObjectById(creep.memory.sourceId);
            let res;
            if (source.structureType) {
                res = creep.withdraw(source, RESOURCE_ENERGY);
            } else {
                res = creep.harvest(source);
            }
            if(res == ERR_NOT_IN_RANGE) {
                const flag = Game.flags[creep.memory.harvestFlagName];
                res = creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffaa00'}});
          //      console.out("res=" + res);
            }
        }
    }
};

module.exports = roleBuilder;