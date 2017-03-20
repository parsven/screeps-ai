


const roleContainerToContainer = {
    role:  'container2container',

    factory: function(spawn, sourcePos, sourceContainerId, destPos, destContainerId, body, taskName) {
        const name = taskName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                sourcePos: sourcePos,
                sourceContainerId: sourceContainerId,
                destPos:destPos,
                destContainerId:destContainerId,
                spawnRoom: spawn.room.name,
                taskName: taskName
            })
        } else {
            return undefined
        }
    },


    /** @param {Creep} creep **/
    run: function(creep) {
        const m = creep.memory;
        if (m.unloading && creep.carry.energy == 0) {
            m.unloading = false;
            creep.say('🔄 harvest');
        }
        if (!m.unloading && creep.carry.energy == creep.carryCapacity) {
            m.unloading = true;
            creep.say('🚧give to the base!');
        }

        if (m.unloading) {
            const brokenStructures = creep.pos.findInRange(FIND_STRUCTURES, 3,
                {filter: (t) =>
                (t.structureType == STRUCTURE_ROAD || t.structureType == STRUCTURE_CONTAINER)
                && t.hits < t.hitsMax
                });
            if(creep.getActiveBodyparts(WORK) > 0 && brokenStructures.length > 0) {
                creep.repair(brokenStructures[0]);
            } else {
                const destContainer = Game.getObjectById(m.destContainerId);
                const destPos = new RoomPosition(m.destPos.x, m.destPos.y, m.destPos.roomName);

                if (destContainer) {
                    if (ERR_NOT_IN_RANGE === creep.transfer(destContainer, RESOURCE_ENERGY)) {
                        creep.moveTo(destContainer, {reusePath: 1})
                    }
                } else {
                    if (creep.pos.isEqualTo(destPos)) {
                        creep.drop(RESOURCE_ENERGY)
                    } else {
                        creep.moveTo(destPos, {reusePath: 1})
                    }
                }
            }
        } else {
            let sourceContainer = Game.getObjectById(m.sourceContainerId);
            const sourcePos = new RoomPosition(m.sourcePos.x, m.sourcePos.y, m.sourcePos.roomName);
//            const energyResource = sourcePos.lookFor(LOOK_ENERGY)[0];
            const energyResource = sourcePos.findInRange(FIND_DROPPED_ENERGY, 1)[0];
            if (energyResource) {
                if (OK == creep.pickup(energyResource)) {
                    return;
                }
            }
            let containerLevel = 0;
            if(creep.memory.containerLevel) {
                containerLevel = creep.memory.containerLevel;
            }
            //Todo, lägg till containerLevel som en facotry parameter!
            if (sourceContainer && sourceContainer.store[RESOURCE_ENERGY] > containerLevel) {
                if (ERR_NOT_IN_RANGE == creep.withdraw(sourceContainer, RESOURCE_ENERGY)) {
                    const reuserFactor = Math.floor(Math.random() * (2));
                    creep.moveTo(sourcePos, {ignoreCreeps: true, reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if (!creep.pos.isEqualTo(sourcePos)) {
                    const reuserFactor = Math.floor(Math.random() * (2));
                    creep.moveTo(sourcePos, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }

            }
        }
    }
};

module.exports = roleContainerToContainer;