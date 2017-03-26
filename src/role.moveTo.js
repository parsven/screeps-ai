/**
 * Created by parsvensson on 2017-03-26.
 */

module.exports = {

    factory: function(spawn, destPos, taskName) {
        return spawn.createCreep([MOVE, CARRY], 'EnergyTransfer' + '-' + Game.time,
            {
                role: this.role,
                destPos: destPos,
                spawnRoom: spawn.room.name,
                taskName: taskName
            });
    },

    role: 'moveTo',

    run: function (creep) {
        const destPos = new RoomPosition(creep.memory.destPos.x, creep.memory.destPos.y, creep.memory.destPos.roomName);
        if(!destPos.isEqualTo(creep.pos)) {
            creep.moveTo(destPos);
        }
    }
};