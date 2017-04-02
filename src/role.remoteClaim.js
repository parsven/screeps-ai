


module.exports = {

    role: 'remoteClaim',

    factory: function (spawn, path, roomController, taskName) {
        const body = [CLAIM, MOVE, MOVE, MOVE];
        const name = taskName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                path: path,
                pathIndex: 0,
                roomController: roomController,
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
        m.working = true;

        console.log("Working?" + m.working);
        if(m.working) {
            const roomController = Game.getObjectById(m.roomController);
            const res = creep.claimController(roomController);
            if( res !== OK) {
                console.log("While claiming roomcontroller, res=" + res);
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