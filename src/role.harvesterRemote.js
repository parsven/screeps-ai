var roleHarvesterRemote = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var room = Game.rooms['E25S63'];
            if(room) {
                var sources = room.find(FIND_SOURCES);
                source = sources[0];
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var dest = new RoomPosition(47,44, 'E25S63');
                creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                var target = creep.pos.findClosestByRange(targets);

                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    var reuserFactor = Math.floor(Math.random() * (5 - 4 + 1)) + 4;
                    creep.moveTo(target, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var dest = new RoomPosition(1,44, 'E26S63');
                creep.moveTo(dest);
            }
        }
    }
};

module.exports = roleHarvesterRemote;