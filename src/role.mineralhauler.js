

const _ = require('lodash');


const UNLOAD1 = "unload1";
const UNLOAD2 = "unload2";
const GETMINERALS = "getminerals";


function mineralContainerInRoom(creep) {
    const mineralContainers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
        && structure.pos.findInRange(FIND_MINERALS, 1).length == 1
    });
    if(mineralContainers.length >0 && _.sum(mineralContainers[0].store) > 0) {
        return mineralContainers[0];
    } else {
        return null;
    }
}
const roleMineralHauler = {

    mineralContainerInRoom: mineralContainerInRoom,
    role: 'mineralHauler',
    /** @param {Creep} creep **/
    run: function(creep) {

        const m = creep.memory;
        if (m.mineralHaulerState == null) {
            if (_.sum(creep.carry) == 0) {
                m.mineralHaulerState = GETMINERALS;
            } else {
                m.mineralHaulerState = UNLOAD1;
            }
        } else {
            if (m.mineralHaulerState == GETMINERALS) {
                const container = mineralContainerInRoom(creep);
                const resourceType =  _.find(Object.keys(container.store), (k) => container.store[k] > 0);
                const res = creep.withdraw(container, resourceType);
//                console.log("c:" + container + " r:" + resourceType);
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (res == OK) {
                    m.mineralHaulerState = UNLOAD2;
                } else {
                    console.log("Problem:" + res);
                }
            } else {
                const target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_STORAGE
                })[0];

                const resourceType =  _.find(Object.keys(creep.carry), (k) => creep.carry[k] > 0);
  //              console.log("resourceType:" + resourceType);
                const res = creep.transfer(target, resourceType);
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (res == OK) {
                    if (m.mineralHaulerState == UNLOAD1) {
                        m.mineralHaulerState = GETMINERALS;
                    } else if (m.mineralHaulerState == UNLOAD2) {
                        m.role = m.oldRole;
                        m.mineralHaulerState = null;
                    } else {
                        console.log("assertion failure!");
                    }
                } else if(res == ERR_INVALID_TARGET) {
                    m.role = m.oldRole;
                    m.mineralHaulerState = null;
                } else {
                    console.log("Promblem2:" + res);
                }

            }

        }
    }


};

module.exports = roleMineralHauler;