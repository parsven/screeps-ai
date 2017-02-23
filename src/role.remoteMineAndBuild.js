const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {

            let structs = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits * 1.0 / object.hitsMax < 0.8 && object.room.name === 'E25S63'
            });

            structs.sort((a, b) => a.hits - b.hits);

            if (structs.length > 0) {
                if (creep.repair(structs[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    const dest = Game.flags['Fallback'];
                    creep.moveTo(dest);
                }
            }
        } else {

            const room = Game.rooms['E25S63'];
            if (room) {
                const sources = room.find(FIND_SOURCES);
                source = sources[0];
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                const dest = new RoomPosition(47, 44, 'E25S63');
                creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;