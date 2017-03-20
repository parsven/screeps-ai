
const roleMineralHauler = require('./role.mineralhauler');

var roleEnergyLoader = {

    role: 'energyLoader',



    factory: function (spawn, body, sourceContainerId, sourcePos, taskName) {
        const name = taskName + '-' + Game.time;
        if( OK == spawn.canCreateCreep(body, name)) {
            return spawn.createCreep(body, name, {
                role: this.role,
                sourcePos: sourcePos,
                sourceContainerId: sourceContainerId,
                spawnRoom: spawn.room.name,
                taskName: taskName
            })
        } else {
            return undefined
        }
    },



    /** @param {Creep} creep **/
    run: function(creep) {

        const m = creep.memory;

        //Todo, temp!
        if(!m.containerId) {
           m.containerId = creep.memory.sourceContainerId;
        }
        if(!m.sourcePos) {
            m.sourcePos = Game.getObjectById(m.containerId).pos;
        }


        if(creep.memory.unloading && creep.carry.energy == 0) {
         //   console.log('apa3');
            creep.memory.unloading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('🚧give to the base!');
        //    console.log('apa2');
        }

        let targets;
        if (creep.memory.unloading) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            let currentContainerLevel = 0;
            const container = Game.getObjectById(creep.memory.containerId);
            if(container) {
                currentContainerLevel = container.store[RESOURCE_ENERGY];
            }
            if(targets.length == 0 && creep.memory.containerLevel &&  currentContainerLevel > creep.memory.containerLevel) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < 0.9 * structure.energyCapacity;
                    }
                });
            }

            if(targets.length == 0 && creep.memory.containerLevel &&  currentContainerLevel > creep.memory.containerLevel) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.id !== creep.memory.containerId
                });
            }

            if (targets.length > 0) {
                const target = creep.pos.findClosestByRange(targets);

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                    const reuserFactor = Math.floor(Math.random() * (2));
                    creep.moveTo(target, {reusePath: reuserFactor, visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if(roleMineralHauler.mineralContainerInRoom(creep) != null) {
                    creep.say("Minerals!!!")
                    creep.memory.role = roleMineralHauler.role;
                    creep.memory.oldRole = this.role;
                } else {
                    //  const dest = spawn.room.controller;
                    const dest = creep.room.find(FIND_MY_SPAWNS)[0];
                    const r = creep.moveTo(dest);
                }

            }
        } else {
            const sourcePos = new RoomPosition(m.sourcePos.x, m.sourcePos.y, m.sourcePos.roomName);
//            const energyResource = sourcePos.lookFor(LOOK_ENERGY)[0];
            const energyResource = sourcePos.findInRange(FIND_DROPPED_ENERGY, 1)[0];

            if (energyResource) {
                if (OK == creep.pickup(energyResource)) {
                    return;
                }
            }
            const res = creep.withdraw(Game.getObjectById(m.containerId), RESOURCE_ENERGY);
            if (res!== OK) {
                creep.moveTo(sourcePos, {reusePath: 1,visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
  //              console.log("qq:" + res)
            }
        }
    }
};

module.exports = roleEnergyLoader;