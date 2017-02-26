var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const roomController = Game.getObjectById('57ef9df386f108ae6e60e8d6');
        if (roomController) {
            if (creep.claimController(roomController) == ERR_NOT_IN_RANGE) {
                creep.moveTo(roomController, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            const dest = new RoomPosition(47, 44, 'E25S63');
            creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = roleBuilder;