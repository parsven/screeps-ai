

const harvester3 = require('role.harvester3');
const util = require('util');

const towerId = '58b32e405ebfe4af390a6e4d';

const towerAttack = function(t) {
    const closestHostile = t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        console.log('Tower is attacking');
        t.attack(closestHostile);
        return true;
    }
    return false;
};

const towerRepair = function(t) {
    const closestDamagedStructure = t.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.hits < structure.hitsMax &&
                structure.structureType !== STRUCTURE_WALL &&
                structure.structureType !== STRUCTURE_RAMPART;
        }
    });

    if(closestDamagedStructure) {
     //   console.log("Repairing damaged strcure of type:" + closestDamagedStructure.structureType);
        t.repair(closestDamagedStructure);
    } else if(t.energy > 820) {
        const damagedWalls = t.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.hits < 300000 &&
                    (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART)
            }
        });
        if(damagedWalls.length > 0) {
            //var item = damagedWalls[Math.floor(Math.random()*damagedWalls.length)];
            const minHits = Math.min.apply(Math,damagedWalls.map(function(o){return o.hits;}));
            const item = damagedWalls.find(function(o){ return o.hits == minHits; });
          //           console.log("My energy is:" + t.energy + " reinforcing:" + item.structureType);
            t.repair(item);
        } else {
        //    console.log("My energy is:" + t.energy + " no action taken!");
        }
    }
};





module.exports = {
    roomName: 'E25S63',

    sourceId: '57ef9df386f108ae6e60e8d7',

    roleDefs: {
        EnergyDelivery: {
            rolename: 'harvester3',
            factory: () => {
                const name = 'EnergyDelivery-' + Game.time;
                const spawn = Game.spawns['Spawn2'];
                const memory = {
                    role: 'harvester3'
                };
                const body = [CARRY, CARRY, MOVE, MOVE];
                if (OK == spawn.canCreateCreep(body, name)) {
                    const result = spawn.createCreep(body, name, memory);
                    console.log('making EnergyDelivery res=' + result);
                } else {
                    //  console.log('fail' + body + name);
                }
            }
        }
    },
    desiredCreepers: {
        distribution: [
            {role: 'EnergyDelivery', cnt: 1, criteria: () => true}
        ]
    },


    towerRun: () => {
        const tower = Game.getObjectById(towerId);

        if (tower) {
            if (!towerAttack(tower) && Game.time % 2 == 0) {
                towerRepair(tower);
            }
        } else {
            console.log('No tower in this rooom!');
        }


    }
};
