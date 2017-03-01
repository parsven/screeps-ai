module.exports = {
    role: 'upgradeAt',

    energyCost: function (workUnits, moveUnits) {
        return 100 * workUnits + 50 * moveUnits + 50;
    },

    factory: function (role, spawn, workUnits, moveUnits, sourceId, controllerId, path, roleName, repairInterval) {
        const _ = require('lodash');
        const name = roleName + '-' + Game.time;
        let body = [];
        _.times(workUnits, ()=> body.push(WORK));
        _.times(moveUnits, ()=> body.push(MOVE));
        body.push(CARRY);
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: role,
                path: path,
                pathIndex: 0,
                sourceId: sourceId,
                controllerId: controllerId,
                repairInterval: repairInterval
            })
        } else {
            return undefined
        }
    },

    /**
     * Follows a path of positions or flags, stays on the last
     * position, mines and drops energy until it dies.
     *
     *
     * @param {Creep} creep
     */
    run: function (creep) {
        if(creep.spawning) {
            return;
        }
        const m = creep.memory;
        if(m.working) {
            if (m.repairInterval && Game.time % m.repairInterval === 0) {
                const container = _.find(creep.room.lookAt(creep),
                    (i) => i.type === 'structure'
                    && i.structure.structureType === 'container');
                creep.repair(container);
                creep.say("Repairing!");
            } else {

                const energyLevel = creep.carry[RESOURCE_ENERGY];
                if (energyLevel === creep.carryCapacity) {
                    m.upgrading = true;
                } else if (energyLevel === 0) {
                    m.upgrading = false;
                }

                if (m.upgrading) {
                    creep.say("M");
                    creep.upgradeController(Game.getObjectById(m.controllerId));
                } else {
                    const droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                    if(droppedEnergy) {
                        const r = creep.pickup(droppedEnergy);
                        if(r === OK) {
                            return;
                        }
                    }
                    console.log('sourceId:' + m.sourceId);
                    const o = Game.getObjectById(m.sourceId);
                    console.log('o:' + JSON.stringify(o));
                    const r = creep.withdraw(Game.getObjectById(m.sourceId), RESOURCE_ENERGY);
                    console.log('r:' + r);
                }

                // }
            }
        } else {
            let targetPos = m.path[m.pathIndex];
            let dest = new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName);
            if(m.pathIndex + 1 == m.path.length) {
                //At the last target in the path, we need to stand right on it.
                if(creep.pos.isEqualTo(dest)) {
                    creep.memory.working = true;
                    //               creep.memory.path = undefined;
                    return this.run(creep)
                }
            } else {
                // At all earlier way points its enough to be near them.
                if(creep.pos.isNearTo(dest)) {
                    m.pathIndex++;
                    targetPos = m.path[m.pathIndex]
                    dest = new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName);
                }
            }
            res = creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffffff'}})
            if(res !== OK) {
                console.log("res:" + res);
            }
        }
    }
};


