const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.say("Apa!");
    //    if(Game.time %2 === 0) return;
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
                filter: object => object.hits * 1.0 / object.hitsMax < 0.85 && object.room.name === 'E29S64'
            });

         //   _.shuffle(structs);
         //   structs.sort((a, b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
  structs =[];
            if (structs.length > 0) {
       //         console.log("Repairing struct w hits=" + structs[0].hits);
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
                    const dest = Game.flags['Fallback2'];
                    creep.moveTo(dest);
                }
            }
        } else {

            creep.say("2");
            const room = Game.rooms['E29S64'];
            if (room) {
                const sources = room.find(FIND_SOURCES);
                creep.say("length=" + sources.length);
                const source = sources[0];
         //       source = Game.getObjectById('58b8a643560dcd5b601230fa');
                const res = creep.harvest(source, RESOURCE_ENERGY);
                creep.say("res=" + res);
                if ( res === ERR_NOT_IN_RANGE || res === ERR_INVALID_TARGET) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.say("5");

                }
            } else {
                const dest = new RoomPosition(34, 25, 'E29S64');
                creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;