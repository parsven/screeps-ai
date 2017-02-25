const roleUpgrader = {

    role: 'upgrader',

    factory: function (spawn, body, sourceId, roleName, harvestPos) {
        const name = roleName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                sourceId: sourceId,
                harvestPos: harvestPos,
            })
        } else {
            return undefined
        }
    },


    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags['Dest1'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const source = Game.getObjectById(creep.memory.sourceId);
            let res;
            if (source.resourceType) {
                res = creep.withdraw(source, RESOURCE_ENERGY);
            } else {
                res = creep.harvest(source);
            }
            if (res != OK) {
                if (res == ERR_NOT_IN_RANGE) {
                    let pos;
                    if(creep.memory.harvestPos) {
                        const harvestPos = creep.memory.harvestPos;
                        pos = new RoomPosition(harvestPos.x, harvestPos.y, harvestPos.roomName);
                    } else {
                        pos = source;
                    }
                    creep.moveTo(pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleUpgrader;