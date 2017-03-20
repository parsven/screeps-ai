module.exports = {
    role: 'miner2',


    factory: function (spawn, body, sourceId, path, taskName) {
        const _ = require('lodash');
        const name = taskName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                path: path,
                pathIndex: 0,
                sourceId: sourceId,
                working: false,
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
            if(creep.carry.energy > 0 && creep.carry.energy == creep.carryCapacity) {
                const containers =creep.pos.findInRange(FIND_STRUCTURES,1, {filter: {structureType: STRUCTURE_CONTAINER}});
                creep.say("Dumping");
                if(containers.length > 0) {
                    creep.transfer(containers[0], RESOURCE_ENERGY);
                } else {
                    creep.drop(RESOURCE_ENERGY);
                }
            } else {
                creep.harvest(Game.getObjectById(m.sourceId));
            }
        } else {
            let targetPos = m.path[m.pathIndex];
            let dest = new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName);
            if(m.pathIndex + 1 == m.path.length) {
                //At the last target in the path, we need to stand right on it.
                if(creep.pos.isEqualTo(dest)) {
                    creep.memory.working = true;
                    return this.run(creep)
                }
            } else {
                // At all earlier way points its enough to be near them.
                if(creep.pos.isNearTo(dest)) {
                    m.pathIndex++;
                    targetPos = m.path[m.pathIndex];
                    dest = new RoomPosition(targetPos.x, targetPos.y, targetPos.roomName);
                }
            }
            res = creep.moveTo(dest, {reusePath: 0,visualizePathStyle: {stroke: '#ffffff'}});
            if(res !== OK) {
                console.log("res:" + res);
            }
        }
    }
};


