
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');


const roleHarvester = require('role.harvester');
const roleHarvester2 = require('role.harvester2');
const roleHarvesterRemote = require('role.harvesterRemote');
const roleUpgrader = require('role.upgrader');
const roleUpgrader2 = require('role.upgrader2');
const roleUpgrader3 = require('role.upgrader3');
const roleRepairer = require('role.repairer');
const roleTowercharger = require('./role.towercharger');
const roleTowercharger2 = require('role.towercharger2');
const roleRemoteRepairAndBuilder = require('role.remoteRepairAndBuild');
const roleClaimer = require('role.claimer');
const roleContainerToContainer = require('./role.containerToContainer');

const roleUpgraderAt = require('./role.upgradeAt')

const towerLogic = require('./tower');


const util = require('util');


const makeRemoteRepairAndBuilder = function() {
    util.build('remoteMineAndBuilder', [WORK, CARRY, CARRY, MOVE, MOVE], "RemoteMineAndBuilder");
};

const makeSmallHarvester = function() {
    util.build('harvester', [WORK, CARRY, MOVE], "SmallHarvester");
};

const makeHarvester = function() {
    util.build('harvester', [MOVE,WORK,WORK,WORK,CARRY], "Harvester");
};

const makeHarvester2 = function() {
    util.build('harvester2', [MOVE,MOVE,WORK,WORK,WORK,CARRY, CARRY], "Harvester2");
};

const makeHarvesterRemote = function() {
    util.build('harvesterRemote', [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK, WORK, WORK], "HarvesterRemote");
};


const makeUpgrader2 = function() {
    util.build('upgrader2', [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY], "Upgrader2");
};

const makeUpgrader3 = function() {
    util.build('upgrader3', [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY], "Upgrader3");
};

const makeRepairer = function() {
    util.build('repairer', [WORK, CARRY, MOVE, MOVE]);
};


const makeTowercharger2 = function() {
    util.build('towercharger2', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY], "Towercharger2");
};

const makeClaimer = function() {
    util.build('claimer', [MOVE,MOVE,CLAIM]);
};




const roomToLeft = require('room.E25S63');

const containerAboveRightOfRoomControlerId = '58b790af5dfd8b1f7a03aabf';
const source2ContainerId = '58b7a3cd1014096b282bcf34';

const roomControllerId = '57ef9df686f108ae6e60e934';

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

    roleDefs: {
        Harvester: {  rolename: 'harvester', factory: makeHarvester },
        Upgrader: { rolename: roleUpgrader.role,
            factory: () => roleUpgrader.factory(
                Game.spawns['Spawn1'],
                [MOVE,MOVE, WORK,WORK, WORK, CARRY, CARRY],
                source1Id,
                'Upgrader'
            )
        },
        Repairer: { rolename: 'repairer', factory: makeRepairer },
        Towercharger: { rolename: 'towercharger',
            factory: () => roleTowercharger.makeHarvestingTowerCharger (
                Game.spawns['Spawn1'],
                [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY],
                source1Id,
                tower1Id,
                "Towercharger")
        },
        Towercharger2: { rolename: 'towercharger2', factory: makeTowercharger2 },
        Harvester2: { rolename: 'harvester2', factory: makeHarvester2 },
        HarvesterRemote: { rolename: 'harvesterRemote', factory: makeHarvesterRemote },
        Builder: { rolename: roleBuilder.role,
            factory: () => roleBuilder.factory(
                Game.spawns['Spawn1'],
                [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                source2Id,
                'BuildSource',
                'Builder')
        },
        Upgrader2: { rolename: 'upgrader2', factory: makeUpgrader2 },
        Upgrader3: { rolename: 'upgrader3', factory: makeUpgrader3 },
        Claimer: { rolename: 'claimer', factory: makeClaimer },
        RemoteMineAndBuilder: { rolename: 'remoteMineAndBuilder', factory: makeRemoteRepairAndBuilder },
        RemoteMine: { rolename: roleMiner.role,
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
            rolename: roleMiner.role,
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn1'],
                source1Id,
                [new RoomPosition(8, 23, module.exports.roomName)],
                'Miner1')
        },
        Miner2: {
            rolename: roleMiner.role,
            factory: () => roleMiner.maxFactory(
                Game.spawns['Spawn1'],
                source2Id,
                [new RoomPosition(28, 23, module.exports.roomName)],
                'Miner2')
        },
        UpgraderAt1: {
            rolename: roleUpgraderAt.role,
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
            rolename: roleUpgraderAt.role,
            factory: () => {
                roleUpgraderAt.factory(
                    roleUpgraderAt.role,
                    Game.spawns['Spawn1'],
                    6, 3,
                    containerAboveRightOfRoomControlerId, //ContainerId
                    roomControllerId,
                    [new RoomPosition(21, 25, 'E26S63')],
                    'UpgraderAt3',
                    16);
            }
        },

        Source2ContainerToUpgradeContainer: {
            rolename: roleContainerToContainer.role,
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


        EnergyLoader: {
            rolename: 'harvester3',
            factory: () => {
                const name = 'EnergyLoader-' + Game.time;
                const spawn = Game.spawns['Spawn2'];
                const memory = {
                    role: 'harvester3',
                    containerLevel: 400,
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
            {role: 'Harvester', cnt: 3, criteria: () => Game.rooms[roomName].energyAvailable < 1400}
            , {role: 'Upgrader', cnt: 2, criteria: always}
      //      , {role: 'Miner1', cnt: 1, criteria: () => true}
            , {role: 'Miner2', cnt: 1, criteria: () => true}
            , {role: 'Repairer', cnt: 0, criteria: () => false}
         //   , {role: 'Harvester2', cnt: 2, criteria: () => Game.rooms[roomName].energyAvailable < 1000}
            , {role: 'Towercharger', cnt: 1, criteria: () => getTower().energy < 830}
            , {role: 'Towercharger2', cnt: 1, criteria: () => getTower2().energy < 830}
    //        , {role: 'RemoteMine', cnt: 1, criteria: always}
  //          , {role: 'HarvesterRemote', cnt: 4, criteria: always}

            , {role: 'UpgraderAt1', cnt: 1, criteria: () => true }
            , {role: 'UpgraderAt3', cnt: 1, criteria: () => true }
            , {role: 'Source2ContainerToUpgradeContainer', cnt: 1, criteria: () => true }

            , {role: 'RemoteMineAndBuilder', cnt: 1, criteria: () => constructionSitesE25S63().length > 0}
            //    ,{role: 'Claimer', cnt: 2, criteria: always }
            , {role: 'Builder', cnt: 1, criteria: () => constructionSitesE26S63().length > 0}
  //          , {role: 'Upgrader2', cnt: 3, criteria: always}
  //          , {role: 'Upgrader3', cnt: 2, criteria: () => constructionSitesE26S63().length === 0}


        ],
        fallback: {role: 'SmallHarvester', max: 2, always}
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


