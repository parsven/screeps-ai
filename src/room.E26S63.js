
//const main = require('main');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');


const roleHarvester = require('role.harvester');
const roleHarvester2 = require('role.harvester2');
const roleHarvesterRemote = require('role.harvesterRemote');
const roleUpgrader = require('role.upgrader');
const roleUpgrader2 = require('role.upgrader2');
const roleUpgrader3 = require('role.upgrader3');
const roleRepairer = require('role.repairer');
const roleTowercharger = require('role.towercharger');
const roleTowercharger2 = require('role.towercharger2');
const roleRemoteRepairAndBuilder = require('role.remoteRepairAndBuild');
const roleClaimer = require('role.claimer');





const build = function(typ, body) {
    const name = typ + '-' + Game.time;
    const spawn = Game.spawns['Spawn1'];
    const memory = {
        role: typ
    };
    if( OK == spawn.canCreateCreep(body, name)) {
        const result = spawn.createCreep( body, name, memory );
        console.log('making ' + typ + ' res=' + result);
    } else {
        //  console.log('fail' + body + name);
    }
};

const makeRemoteRepairAndBuilder = function() {
    build('remoteMineAndBuilder', [WORK, CARRY, CARRY, MOVE, MOVE]);
};

const makeSmallHarvester = function() {
    build('harvester', [WORK, CARRY, MOVE]);
};

const makeHarvester = function() {
    build('harvester', [MOVE,WORK,WORK,WORK,CARRY]);
};

const makeHarvester2 = function() {
    build('harvester2', [MOVE,MOVE,WORK,WORK,WORK,CARRY, CARRY]);
};

const makeHarvesterRemote = function() {
    build('harvesterRemote', [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK, WORK, WORK]);
};


const makeUpgrader2 = function() {
    build('upgrader2', [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

const makeUpgrader3 = function() {
    build('upgrader3', [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

const makeRepairer = function() {
    build('repairer', [WORK, CARRY, MOVE, MOVE]);
};

const makeTowercharger = function() {
    build('towercharger', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

const makeTowercharger2 = function() {
    build('towercharger2', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

const makeClaimer = function() {
    build('claimer', [MOVE,MOVE,CLAIM]);
};


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
        //console.log("Repairing damaged strcure of type:" + closestDamagedStructure.structureType);
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
            //          console.log("My energy is:" + t.energy + " reinforcing:" + item.structureType);
            t.repair(item);
        } else {
            //          console.log("My energy is:" + t.energy + " no action taken!");
        }
    }
};






const roomToLeft = require('room.E25S63');


const source1Id = '';
const source2Id = '';

const getTower = () => Game.getObjectById('58a84e66120c7b1c6451f132');
const getTower2 = () => Game.getObjectById('58aed3482be237616065a48d');

const constructionSitesE26S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E26S63';
});

const always = function() {return true};

const roomName = 'E26S63'

module.exports = {

    roomName : roomName,

    roleDefs: {
        Harvester: {  rolename: 'harvester', factory: makeHarvester },
        Upgrader: { rolename: roleUpgrader.role,
            factory: () => roleUpgrader.factory(
                Game.spawns['Spawn1'],
                [MOVE,WORK,CARRY],
                '57ef9df686f108ae6e60e932',
                'Upgrader'
            )
        },
        Repairer: { rolename: 'repairer', factory: makeRepairer },
        Towercharger: { rolename: 'towercharger', factory: makeTowercharger },
        Towercharger2: { rolename: 'towercharger2', factory: makeTowercharger2 },
        Harvester2: { rolename: 'harvester2', factory: makeHarvester2 },
        HarvesterRemote: { rolename: 'harvesterRemote', factory: makeHarvesterRemote },
        Builder: { rolename: roleBuilder.role,
            factory: () => roleBuilder.factory(
                Game.spawns['Spawn1'],
                [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                '57ef9df686f108ae6e60e933',
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
                5)
        },
        SmallHarvester: { rolename: 'harvester', factory: makeSmallHarvester }

    },

    desiredCreepers: {
        distribution: [
            {role: 'Harvester', cnt: 4, criteria: () => Game.rooms[roomName].energyAvailable < 1400}
            , {role: 'Upgrader', cnt: 1, criteria: always}
            , {role: 'Repairer', cnt: 0, criteria: always}
            , {role: 'Harvester2', cnt: 3, criteria: () => Game.rooms[roomName].energyAvailable < 1000}
            , {role: 'Towercharger', cnt: 1, criteria: () => getTower().energy < 830}
            , {role: 'Towercharger2', cnt: 1, criteria: () => getTower2().energy < 830}
            , {role: 'Upgrader2', cnt: 3, criteria: always}
            , {role: 'RemoteMine', cnt: 1, criteria: always}
            , {role: 'HarvesterRemote', cnt: 4, criteria: always}
            , {role: 'RemoteMineAndBuilder', cnt: 2, criteria: always}
            //    ,{role: 'Claimer', cnt: 2, criteria: always }
            , {role: 'Builder', cnt: 1, criteria: () => constructionSitesE26S63().length > 0}
            , {role: 'Upgrader3', cnt: 2, criteria: () => constructionSitesE26S63().length === 0}
        ],
        fallback: {role: 'SmallHarvester', max: 2, always}
    },


    towerRun: () => {
        const tower = getTower();
        const tower2 = getTower2();

        if(tower) {
            if(!towerAttack(tower) && Game.time % 2 == 0) {
                towerRepair(tower);
            }
        } else {
            console.log('No tower1 found!');
        }
        if(tower2) {
            if(!towerAttack(tower2) && Game.time % 2 == 1) {
                towerRepair(tower2);
            }
        } else {
            console.log('No tower2 found!');
        }


    }


};


