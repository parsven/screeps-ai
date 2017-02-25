const roleHarvester = require('role.harvester');
const roleHarvester2 = require('role.harvester2');
const roleHarvesterRemote = require('role.harvesterRemote');
const roleUpgrader = require('role.upgrader');
const roleUpgrader2 = require('role.upgrader2');
const roleUpgrader3 = require('role.upgrader3');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleTowercharger = require('role.towercharger');
const roleTowercharger2 = require('role.towercharger2');
const roleRemoteRepairAndBuilder = require('role.remoteRepairAndBuild');
const roleClaimer = require('role.claimer');
const roleMiner = require('role.miner');

const _ = require('lodash');

const cntCreepsOfType = function (t) {
    return _.filter(Game.creeps, function (o) {
        return o.memory.role === t
    }).length;
};

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

module.exports.makeRemoteRepairAndBuilder = function() {
    build('remoteMineAndBuilder', [WORK, CARRY, CARRY, MOVE, MOVE]);
};

module.exports.makeSmallHarvester = function() {
    build('harvester', [WORK, CARRY, MOVE]);
};

module.exports.makeHarvester = function() {
    build('harvester', [MOVE,WORK,WORK,WORK,CARRY]);
};

module.exports.makeHarvester2 = function() {
    build('harvester2', [MOVE,MOVE,WORK,WORK,WORK,CARRY, CARRY]);
};

module.exports.makeHarvesterRemote = function() {
    build('harvesterRemote', [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]);
};

module.exports.makeUpgrader = function() {
//    build('upgrader', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
    build('upgrader', [MOVE,WORK,CARRY]);
};

module.exports.makeUpgrader2 = function() {
    build('upgrader2', [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

module.exports.makeUpgrader3 = function() {
    build('upgrader3', [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

module.exports.makeRepairer = function() {
    build('repairer', [WORK, CARRY, MOVE, MOVE]);
};

module.exports.makeTowercharger = function() {
    build('towercharger', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

module.exports.makeTowercharger2 = function() {
    build('towercharger2', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
};

module.exports.makeClaimer = function() {
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


const getTower = () => Game.getObjectById('58a84e66120c7b1c6451f132');
const getTower2 = () => Game.getObjectById('58aed3482be237616065a48d');
const constructionSitesE26S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
        return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E26S63';
    });


const energySourceE25S63id = '57ef9df386f108ae6e60e8d7';

const roleDefs = {
    Harvester: {
        rolename: 'harvester', factory: module.exports.makeHarvester
    },
    Upgrader: {
        rolename: 'upgrader', factory: module.exports.makeUpgrader
    },
    Repairer: {
        rolename: 'repairer', factory: module.exports.makeRepairer
    },
    Towercharger: {
        rolename: 'towercharger', factory: module.exports.makeTowercharger
    },
    Towercharger2: {
        rolename: 'towercharger2', factory: module.exports.makeTowercharger2
    },
    Harvester2: {
        rolename: 'harvester2', factory: module.exports.makeHarvester2
    },
    HarvesterRemote: {
        rolename: 'harvesterRemote', factory: module.exports.makeHarvesterRemote
    },
    Builder: {
        rolename: roleBuilder.role,
        factory: () => roleBuilder.factory(
            Game.spawns['Spawn1'],
            [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            '57ef9df686f108ae6e60e933',
            'BuildSource',
            'Builder')
    },
    Upgrader2: {
        rolename: 'upgrader2', factory: module.exports.makeUpgrader2
    },
    Upgrader3: {
        rolename: 'upgrader3', factory: module.exports.makeUpgrader3
    },
    Claimer: {
        rolename: 'claimer', factory: module.exports.makeClaimer
    },
    RemoteMineAndBuilder: {
        rolename: 'remoteMineAndBuilder', factory: module.exports.makeRemoteRepairAndBuilder
    },
    RemoteMine: {
        rolename: roleMiner.role,
        factory: () => roleMiner.maxFactory(
            Game.spawns['Spawn1'],
            energySourceE25S63id,
            [   new RoomPosition(14,19, 'E26S63'),
                new RoomPosition(7,34, 'E26S63'),
                new RoomPosition(1,41, 'E26S63'),
                new RoomPosition(30,46, 'E25S63'),
                new RoomPosition(20,41, 'E25S63')],
            'RemoteMineE25S63',
            4)
    },
    SmallHarvester: {
        rolename: 'harvester', factory: module.exports.makeSmallHarvester
    }

};


const always = function() {return true};

const desiredCreepersE26S63 = {
    distribution: [
         {role: 'Harvester', cnt: 1, criteria: () => Game.rooms['E26S63'].energyAvailable < 400 }
        ,{role: 'Upgrader', cnt: 1, criteria: always }
        ,{role: 'Repairer', cnt: 0, criteria: always }
        ,{role: 'RemoteMine', cnt: 1, criteria: always }
        ,{role: 'HarvesterRemote', cnt: 4, criteria: always }
        ,{role: 'RemoteMineAndBuilder', cnt: 2, criteria: always }
        ,{role: 'Claimer', cnt: 2, criteria: always }
        ,{role: 'Towercharger', cnt: 2, criteria: () => getTower().energy < 830 }
        ,{role: 'Towercharger2', cnt: 1, criteria: () => getTower2().energy < 830 }
    //    ,{role: 'Harvester2', cnt: 3, criteria: () => Game.rooms['E26S63'].energyAvailable < 1000 }
        ,{role: 'Builder', cnt: 1, criteria: () => constructionSitesE26S63().length > 0 }
        ,{role: 'Upgrader2', cnt: 3, criteria: always }
        ,{role: 'Upgrader3', cnt: 3, criteria: () => constructionSitesE26S63().length === 0 }
    ],
    fallback: { role: 'SmallHarvester', max:2, always}

};


const spawnLogic = function(desiredCreepers, spawn) {

    let spawnCandidate;

    let str = "";

    for( let i in desiredCreepers.distribution ) {
        const r = desiredCreepers.distribution[i];
        const role = roleDefs[r.role];
        if(role === undefined) {
            console.log("role:" + r.role + " is undefined!");
        }
        const rolename = role.rolename;
        const currentCnt = cntCreepsOfType(rolename);
        const line = "[" + currentCnt + "/" + r.cnt + "] " + r.role;
        if(r.criteria()) {
            str = str + "  " + line +"\n";
            if(!spawnCandidate && currentCnt < r.cnt) {
                spawnCandidate = r.role;
            }
        } else {
            str = str + "( " + line +" )\n";
        }
    }

    str = str + "energy in room: ["
        + spawn.room.energyAvailable + "/"
        + spawn.room.energyCapacityAvailable + "]\n";

    if(spawnCandidate) {
        str = str + "Next to spawn is: " + spawnCandidate + "\n";
        const factory = roleDefs[spawnCandidate].factory;
        factory();
    } else {
        str = str + "Nothing new to spawn!\n"
    }

    return str;
};




module.exports.loop = function () {
// Garbage collect memory from dead creeps.
    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

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

    if(Game.time % 10 === 0 && Game.spawns['Spawn1'].spawning === null)
    {

        let logStr = "=========================\n"
            + spawnLogic(desiredCreepersE26S63, Game.spawns['Spawn1']);

        console.log(logStr);

        if(cntCreepsOfType('harvester') == 0) {
            module.exports.makeSmallHarvester();    
        }
    }


    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if(Game.time % 3 ===0) {
            creep.say(creep.memory.role);
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'harvester2') {
            roleHarvester2.run(creep);
        }
        if (creep.memory.role == 'harvesterRemote') {
            roleHarvesterRemote.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'upgrader2') {
            roleUpgrader2.run(creep);
        }
        if (creep.memory.role == 'upgrader3') {
            roleUpgrader3.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'towercharger') {
            roleTowercharger.run(creep);
        }
        if (creep.memory.role == 'towercharger2') {
            roleTowercharger2.run(creep);
        }
        if (creep.memory.role == 'remoteMineAndBuilder') {
            roleRemoteRepairAndBuilder.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role == roleMiner.role) {
            roleMiner.run(creep);
        }
    }
};