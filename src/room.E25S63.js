

const harvester3 = require('./role.harvester3');
const util = require('./util');
const towerLogic = require('./tower');

const towerId = '58b32e405ebfe4af390a6e4d';



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
            if (!towerLogic.towerAttack(tower) && Game.time % 2 == 0) {
                towerLogic.towerRepair(tower);
            }
        } else {
            console.log('No tower in this rooom!');
        }


    }
};
