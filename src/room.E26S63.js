
const roleBuilder = require('./role.builder');
const roleMiner = require('./role.miner');
const roleUpgrader = require('./role.upgrader');
const roleTowercharger = require('./role.towercharger');
const roleClaimer = require('./role.claimer');
const roleContainerToContainer = require('./role.containerToContainer');
const roleEnergyLoader = require('./role.energyLoader');
const roleUpgraderAt = require('./role.upgradeAt');

const towerLogic = require('./tower');


const util = require('util');


const makeRemoteRepairAndBuilder = function() {
    util.build('remoteMineAndBuilder', [WORK, CARRY, CARRY, MOVE, MOVE], "RemoteMineAndBuilder");
};

const makeSmallHarvester = function() {
    util.build('harvester', [WORK, CARRY, MOVE], "SmallHarvester");
};

const makeHarvester = function() {
    util.build('harvester', [MOVE,WORK,CARRY], "Harvester");
};



const makeRepairer = function() {
    util.build('repairer', [WORK, CARRY, MOVE, MOVE]);
};


const makeClaimer = function() {
    util.build('claimer', [MOVE,MOVE,CLAIM]);
};




const roomToLeft = require('./room.E25S63');

const containerAboveRightOfRoomControlerId = '58b790af5dfd8b1f7a03aabf';
const containerAboveLeftOfRoomControlerId = '58bb4818aaee09a45b0ac6b9';


const source2ContainerId = '58b7a3cd1014096b282bcf34';

const roomControllerId = '57ef9df686f108ae6e60e934';

const containerAtSource1Id = '58b77e38fb6ac8904f67a009';

const source1Id = '57ef9df686f108ae6e60e932';
const source2Id = '57ef9df686f108ae6e60e933';

const tower1Id = '58a84e66120c7b1c6451f132';
const tower2Id = '58aed3482be237616065a48d';

const getTower = () => Game.getObjectById(tower1Id);
const getTower2 = () => Game.getObjectById(tower2Id);

const constructionSitesE26S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E26S63';
});

const constructionSitesE25S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E25S63';
});

const always = function() {return true};

const roomName = 'E26S63';

module.exports = {

    roomName : roomName,

    taskDefs: {
        Harvester: {  factory: makeHarvester },
        Upgrader: {
            factory: () => roleUpgrader.factory(
                Game.spawns['Spawn1'],
                [MOVE, WORK, CARRY],
                source1Id,
                'Upgrader'
            )
        },
        Repairer: { factory: makeRepairer },
        Towercharger: {
            factory: () => roleTowercharger.makeWithdrawingTowerCharger(
                Game.spawns['Spawn1'],
                [MOVE,MOVE,CARRY,CARRY],
                containerAtSource1Id,
                tower1Id,
                "Towercharger")
        },
        Towercharger2: { factory: () => roleTowercharger.makeWithdrawingTowerCharger(
                Game.spawns['Spawn1'],
                [MOVE,MOVE,CARRY,CARRY],
                containerAtSource1Id,
                tower2Id,
                "Towercharger2")
        },
        Builder: {
            factory: () => roleBuilder.factory(
                Game.spawns['Spawn1'],
                [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                source1Id,
                'BuildSource',
                'Builder')
        },
        Claimer: {  factory: makeClaimer },
        RemoteMineAndBuilder: { factory: makeRemoteRepairAndBuilder },
        RemoteMine: {
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn1'],
                roomToLeft.sourceId,
                [   new RoomPosition(14,19, roomName),
                    new RoomPosition(7,34, roomName),
                    new RoomPosition(1,41, roomName),
                    new RoomPosition(30,46, roomToLeft.roomName),
                    new RoomPosition(20,41, roomToLeft.roomName)],
                'RemoteMine',
                7)
        },
        Miner1: {
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn1'],
                source1Id,
                [new RoomPosition(9, 23, module.exports.roomName)],
                'Miner1')
        },
        Miner2: {
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn1'],
                source2Id,
                [new RoomPosition(28, 23, module.exports.roomName)],
                'Miner2')
        },
        UpgraderAt1: {
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role,
                    Game.spawns['Spawn1'],
                    7, 3,
                    containerAboveRightOfRoomControlerId, //ContainerId
                    roomControllerId,
                    [new RoomPosition(20, 24, 'E26S63')],
                    'UpgraderAt1',
                    16);
            }
        },
        UpgraderAt3: {
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role,
                    Game.spawns['Spawn1'],
                    7, 3,
                    containerAboveRightOfRoomControlerId,
                    roomControllerId,
                    [new RoomPosition(21, 25, 'E26S63')],
                    'UpgraderAt3',
                    16);
            }
        },

        UpgraderAt4: {
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role,
                    Game.spawns['Spawn1'],
                    5, 3,
                    containerAboveLeftOfRoomControlerId,
                    roomControllerId,
                    [new RoomPosition(16, 24, 'E26S63')],
                    'UpgraderAt4',
                    16);
            }
        },

        Source2ContainerToUpgradeContainer: {
            factory: () => {
                roleContainerToContainer.factory(
                    Game.spawns['Spawn1'],
                    new RoomPosition(28,23,'E26S63'),
                    source2ContainerId,
                    new RoomPosition(21,24,'E26S63'),
                    containerAboveRightOfRoomControlerId,
                    [CARRY, CARRY, CARRY, MOVE, MOVE],
                    "Source2ContainerToUpgradeContainer"
                );
            }
        },

        Source1ContainerToUpgradeContainer: {
            factory: () => {
                roleContainerToContainer.factory(
                    Game.spawns['Spawn1'],
                    new RoomPosition(9,23,'E26S63'),
                    containerAtSource1Id,
                    new RoomPosition(16,25,'E26S63'),
                    containerAboveLeftOfRoomControlerId,
                    [CARRY, CARRY, MOVE, MOVE],
                    "Source1ContainerToUpgradeContainer"
                );
            }
        },

        EnergyLoader: {
            factory: () => {
                const name = 'EnergyLoader-' + Game.time;
                const spawn = Game.spawns['Spawn1'];
                const memory = {
                    role: roleEnergyLoader.role,
                    containerLevel: 400,
                    containerId: containerAtSource1Id,
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


        SmallHarvester: { rolename: 'harvester', factory: makeSmallHarvester }

    },

    desiredCreepers: {
        distribution: [
              {task: 'Harvester', cnt: 1, criteria: () => Game.rooms[roomName].energyAvailable < 400}
      //      , {task: 'Upgrader', cnt: 2, criteria: always}
            , {task: 'EnergyLoader', cnt: 1, criteria: () => true}
            , {task: 'Miner1', cnt: 1, criteria: () => true}
            , {task: 'Miner2', cnt: 1, criteria: () => true}
            , {task: 'Repairer', cnt: 0, criteria: () => false}
            , {task: 'Towercharger', cnt: 1, criteria: () => getTower().energy < 830}
            , {task: 'Towercharger2', cnt: 1, criteria: () => getTower2().energy < 830}

            , {task: 'UpgraderAt1', cnt: 1, criteria: () => true }
            , {task: 'UpgraderAt3', cnt: 1, criteria: () => true }
            , {task: 'Source2ContainerToUpgradeContainer', cnt: 1, criteria: () => true }
            , {task: 'Source1ContainerToUpgradeContainer', cnt: 1, criteria: () => true }
            , {task: 'UpgraderAt4', cnt: 1, criteria: () => true }

            , {task: 'RemoteMineAndBuilder', cnt: 1, criteria: () => constructionSitesE25S63().length > 0}
            , {task: 'Builder', cnt: 1, criteria: () => constructionSitesE26S63().length > 0}

        ],
        fallback: {task: 'SmallHarvester', max: 2, always}
    },


    towerRun: () => {
        const tower = getTower();
        const tower2 = getTower2();

        if(tower) {
            if(!towerLogic.towerAttack(tower) && Game.time % 2 == 0) {
                towerLogic.towerRepair(tower);
            }
        } else {
            console.log('No tower1Id found!');
        }
        if(tower2) {
            if(!towerLogic.towerAttack(tower2) && Game.time % 2 == 1) {
                towerLogic.towerRepair(tower2);
            }
        } else {
            console.log('No tower2 found!');
        }


    }


};


