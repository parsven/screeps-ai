
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

const towerLogic = require('./tower');


const util = require('util');


const makeRemoteRepairAndBuilder = function() {
    util.build('remoteMineAndBuilder', [WORK, CARRY, CARRY, MOVE, MOVE], "RemoteRepairAndBuilder");
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
    util.build('towercharger2', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY], "TowerCharger2");
};

const makeClaimer = function() {
    util.build('claimer', [MOVE,MOVE,CLAIM]);
};




const roomToLeft = require('room.E25S63');


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
                [MOVE,WORK,CARRY],
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
                "TowerCharger")
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
                'RemoteMineE25S63',
                7)
        },
        SmallHarvester: { rolename: 'harvester', factory: makeSmallHarvester }

    },

    desiredCreepers: {
        distribution: [
            {role: 'Harvester', cnt: 4, criteria: () => Game.rooms[roomName].energyAvailable < 1400}
            , {role: 'Upgrader', cnt: 1, criteria: always}
            , {role: 'Repairer', cnt: 0, criteria: always}
         //   , {role: 'Harvester2', cnt: 2, criteria: () => Game.rooms[roomName].energyAvailable < 1000}
            , {role: 'Towercharger', cnt: 2, criteria: () => getTower().energy < 830}
            , {role: 'Towercharger2', cnt: 1, criteria: () => getTower2().energy < 830}
    //        , {role: 'RemoteMine', cnt: 1, criteria: always}
  //          , {role: 'HarvesterRemote', cnt: 4, criteria: always}
            , {role: 'RemoteMineAndBuilder', cnt: 1, criteria: () => constructionSitesE25S63().length > 0}
            //    ,{role: 'Claimer', cnt: 2, criteria: always }
            , {role: 'Builder', cnt: 1, criteria: () => constructionSitesE26S63().length > 0}
            , {role: 'Upgrader2', cnt: 3, criteria: always}
            , {role: 'Upgrader3', cnt: 2, criteria: () => constructionSitesE26S63().length === 0}
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


