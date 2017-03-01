

const harvester3 = require('./role.harvester3');
const util = require('./util');
const towerLogic = require('./tower');
const roleMiner = require('./role.miner');
const roleUpgraderAt = require('./role.upgradeAt');
const roleContainerToContainer = require('./role.containerToContainer');


const towerId = '58b32e405ebfe4af390a6e4d';


const containerAtRoomController = '58b5dd69acca48f132708228';


module.exports = {
    roomName: 'E25S63',

    sourceId: '57ef9df386f108ae6e60e8d7',

    roleDefs: {
        EnergyLoader: {
            rolename: 'harvester3',
            factory: () => {
                const name = 'EnergyLoader-' + Game.time;
                const spawn = Game.spawns['Spawn2'];
                const memory = {
                    role: 'harvester3',
                    containerLevel: 400
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
            rolename: roleMiner.role,
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn2'],
                module.exports.sourceId,
                [new RoomPosition(20, 41, module.exports.roomName)],
                'TheMiner')
        },
        UpgraderAt1: {
            rolename: roleUpgraderAt.role + '1',
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role + '1',
                    Game.spawns['Spawn2'],
                    2, 2,
                    containerAtRoomController, //ContainerId
                    '57ef9df386f108ae6e60e8d6',
                    [new RoomPosition(37, 28, 'E25S63')],
                    'Upgrader1',
                    16);
            }
        },
        UpgraderAt2: {
            rolename: roleUpgraderAt.role + '2',
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role + '2',
                    Game.spawns['Spawn2'],
                    2, 2,
                    containerAtRoomController, //ContainerId
                    '57ef9df386f108ae6e60e8d6',
                    [new RoomPosition(36, 28, 'E25S63')],
                    'Upgrader2',
                    16);
            }
        },
        UpgraderAt3: {
            rolename: roleUpgraderAt.role + '3',
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role + '3',
                    Game.spawns['Spawn2'],
                    2, 2,
                    containerAtRoomController, //ContainerId
                    '57ef9df386f108ae6e60e8d6',
                    [new RoomPosition(37, 29, 'E25S63')],
                    'Upgrader3',
                    16);
            }
        },
        SourceContainerToUpgradeContainer: {
            rolename: roleContainerToContainer.role,
            factory: () => {
                roleContainerToContainer.factory(
                    Game.spawns['Spawn2'],
                    new RoomPosition(20,41,'E25S63'),
                    '58af8d5fdb3b7b23072eed6f',
                    new RoomPosition(36,29,'E25S63'),
                    '58b5dd69acca48f132708228',
                    [CARRY, CARRY, CARRY, MOVE, MOVE],
                    "SourceToUpgrader"
                );
            }
        }
    },
    desiredCreepers: {
        distribution: [
            {role: 'Miner', cnt: 1, criteria: () => true},
            {role: 'EnergyLoader', cnt: 1, criteria: () => true},
            {role: 'UpgraderAt1', cnt: 1, criteria: () => true},
            {role: 'UpgraderAt2', cnt: 1, criteria: () => true},
            {role: 'UpgraderAt3', cnt: 1, criteria: () => true},
            {role: 'SourceContainerToUpgradeContainer', cnt: 2, criteria: () => true}
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
