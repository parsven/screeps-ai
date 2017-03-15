


module.exports = {

    role: 'attackStructure',

    factory: function (spawn, body, path, attackStructure, taskName) {
        const name = taskName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                path: path,
                pathIndex: 0,
                attackStructure: attackStructure,
                spawnRoom: spawn.room.name,
                taskName: taskName
            })
        } else {
            return undefined
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.spawning) {
            return;
        }
        const m = creep.memory;
        if(m.working) {
            const attackStructure = Game.getObjectById(m.attackStructure);
            const res = creep.attack(attackStructure);
            if( res !== OK) {
                console.log("While attacking structure, res=" + res);
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
            res = creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffffff'}})
            if(res !== OK) {
                console.log("res:" + res);
            }
        }
    }




};