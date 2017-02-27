
const util = require('util');

const roleTowercharger = {

    role: 'towercharger',

    makeHarvestingTowerCharger: function (spawn, body, sourceId, towerId, roleName) {
        const name = roleName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                sourceId: sourceId,
                towerId: towerId
            })
        } else {
            return undefined
        }
    },

    makeWithdrawingTowerCharger: function (spawn, body, withdrawStructureId, towerId, roleName) {
        const name = roleName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                withdrawStructureId: withdrawStructureId,
                towerId: towerId
            })
        } else {
            return undefined
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.memory.sourceId) {
                const source = Game.getObjectById(creep.memory.sourceId);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if(creep.memory.withdrawStructureId) {
                const structure = Game.getObjectById(creep.memory.withdrawStructureId);
                if(creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity
                        && structure.id === creep.memory.towerId;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                const fallback = Game.flags['Fallback'];
                creep.moveTo(fallback);
            }
        }
    }
};

module.exports = roleTowercharger;