module.exports = {
    role: 'miner',

    maxEnergyCost: function () {
        return this.energyCost(6,3)
    },

    maxFactory: function(spawn, sourceId, path, taskName, repairInteval) {
        return this.factory(spawn, 6, 3, sourceId, path, taskName, repairInteval)
    },

    energyCost: function (workUnits, moveUnits) {
        return 100 * workUnits + 50 * moveUnits + 50;
    },

    factory: function (spawn, workUnits, moveUnits, sourceId, path, taskName, repairInterval) {
        const _ = require('lodash');
        const name = taskName + '-' + Game.time;
        let body = [];
        _.times(workUnits, ()=> body.push(WORK));
        _.times(moveUnits, ()=> body.push(MOVE));
        if(repairInterval) {
            body.push(CARRY);
        }
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                path: path,
                pathIndex: 0,
                sourceId: sourceId,
                working: false,
                repairInterval: repairInterval,
                spawnRoom: spawn.room.name,
                taskName: taskName
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
            if(m.repairInterval && Game.time % m.repairInterval === 0) {
                const container = _.find(creep.room.lookAt(creep),
                        (i) => i.type === 'structure'
                                && i.structure.structureType === 'container');
                creep.repair(container);
                creep.say("Repairing!");
            } else {
                creep.say("M");
                creep.harvest(Game.getObjectById(m.sourceId));
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


