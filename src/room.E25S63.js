

const energyLoader = require('./role.energyLoader');
const util = require('./util');
const towerLogic = require('./tower');
const roleMiner = require('./role.miner');
const roleUpgraderAt = require('./role.upgradeAt');
const roleContainerToContainer = require('./role.containerToContainer');
const roleMiner2 = require('./role.miner2');



const towerId = '58b32e405ebfe4af390a6e4d';
const tower2Id = '58bb06a5e962dead60f200c1';


const containerAtRoomController = '58b5dd69acca48f132708228';
const containerAtEnergySource = '58af8d5fdb3b7b23072eed6f';

const mineralContainer = '58c89659945f9d612466c1de';
const mineralSource = '57efa013195b160f02c75404';

module.exports = {
    roomName: 'E25S63',

    sourceId: '57ef9df386f108ae6e60e8d7',

    taskDefs: {
        EnergyLoader: {
            factory: () => {
                const name = 'EnergyLoader-' + Game.time;
                const spawn = Game.spawns['Spawn2'];
                const memory = {
                    role: energyLoader.role,
                    containerLevel: 1,
                    containerId: containerAtEnergySource,
                    spawnRoom: spawn.room.name,
                    taskName: 'EnergyLoader'
                };
                const body = [CARRY, CARRY, MOVE, MOVE];
                if (OK == spawn.canCreateCreep(body, name)) {
                    const result = spawn.createCreep(body, name, memory);
                    console.log('making EnergyLoader res=' + result);
                } else {
                    //  console.log('fail' + body + name);
                }
            }
        },
        Miner: {
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn2'],
                module.exports.sourceId,
                [new RoomPosition(20, 41, module.exports.roomName)],
                'Miner')
        },
        MinerMineral: {
            factory: () => {
                roleMiner2.factory(Game.spawns['Spawn2'], [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK],
                    mineralSource, [Game.getObjectById(mineralContainer).pos], 'MinerMineral');

            }

        },
        UpgraderAt1: {
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role,
                    Game.spawns['Spawn2'],
                    3, 2,
                    containerAtRoomController, //ContainerId
                    '57ef9df386f108ae6e60e8d6',
                    [new RoomPosition(37, 28, 'E25S63')],
                    'UpgraderAt1',
                    16);
            }
        },
        UpgraderAt2: {
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role,
                    Game.spawns['Spawn2'],
                    4, 3,
                    containerAtRoomController, //ContainerId
                    '57ef9df386f108ae6e60e8d6',
                    [new RoomPosition(36, 28, 'E25S63')],
                    'UpgraderAt2',
                    16);
            }
        },
        SourceContainerToUpgradeContainer: {
            factory: () => {
                roleContainerToContainer.factory(
                    Game.spawns['Spawn2'],
                    new RoomPosition(20,41,'E25S63'),
                    '58af8d5fdb3b7b23072eed6f',
                    new RoomPosition(36,29,'E25S63'),
                    '58b5dd69acca48f132708228',
                    [CARRY, CARRY, CARRY, MOVE, MOVE],
                    "SourceContainerToUpgradeContainer"
                );
            }
        }
    },
    desiredCreepers: {
        distribution: [
            {task: 'Miner', cnt: 1, criteria: () => true},
            {task: 'EnergyLoader', cnt: 1, criteria: () => true},
            {task: 'UpgraderAt1', cnt: 1, criteria: () => true},
            {task: 'UpgraderAt2', cnt: 1, criteria: () => true},
            {task: 'SourceContainerToUpgradeContainer', cnt: 2, criteria: () => true},
      //      {task: 'MinerMineral', cnt: 1, criteria: () => (Game.getObjectById(mineralSource).mineralAmount > 0
        //            && _.sum(Game.getObjectById(mineralContainer).store) < 1600)}

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


        const tower2 = Game.getObjectById(tower2Id);
        if (tower2) {
            if (!towerLogic.towerAttack(tower2) && Game.time % 2 == 0) {
                towerLogic.towerRepair(tower2);
            }
        } else {
            console.log('No tower in this rooom!');
        }



    }
};
