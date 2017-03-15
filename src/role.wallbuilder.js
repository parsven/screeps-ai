const _ = require('lodash');


const roleWallBuilder = {

    role: 'wallbuilder',

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

            const walls = creep.room.find(FIND_STRUCTURES,
                {filter: (t) =>
                    (t.structureType == STRUCTURE_WALL)
                });
            console.log("walls.length = "+ walls.length);
            walls.sort((a, b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            console.log("walls.length = "+ walls.length);

            creep.memory.targetWall = walls[0].id;
        }

        if(creep.memory.building) {
            const target = Game.getObjectById(creep.memory.targetWall);
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                const reuserFactor = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
                creep.moveTo(target, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {

            const source = Game.getObjectById(creep.memory.sourceId);
            let res;
            if (source.structureType) {
                res = creep.withdraw(source, RESOURCE_ENERGY);
            } else {
                res = creep.harvest(source);
            }
            if(res == ERR_NOT_IN_RANGE) {
                const flag = Game.flags[creep.memory.harvestFlagName];
                const reuserFactor = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
                res = creep.moveTo(flag, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffaa00'}});
                //      console.out("res=" + res);
            }
        }
    }
};

module.exports = roleWallBuilder;