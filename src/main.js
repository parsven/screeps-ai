const roleHarvester = require('role.harvester');
const roleHarvester2 = require('role.harvester2');
const roleUpgrader = require('role.upgrader');
const roleUpgrader2 = require('role.upgrader2');
const roleUpgrader3 = require('role.upgrader3');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleTowercharger = require('role.towercharger');
const roleRemoteMineAndBuilder = require('role.remoteMineAndBuild');

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

module.exports.makeRemoteMineAndBuilder = function() {
    build('remoteMineAndBuilder', [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]);
};

module.exports.makeSmallHarvester = function() {
    build('harvester', [WORK, CARRY, MOVE]);
};

module.exports.makeBuilder = function() {
    build('builder', [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
};

module.exports.makeHarvester = function() {
    build('harvester', [MOVE,WORK,WORK,WORK,CARRY]);
};

module.exports.makeHarvester2 = function() {
    build('harvester2', [MOVE,MOVE,WORK,WORK,WORK,CARRY, CARRY]);
};

module.exports.makeUpgrader = function() {
    build('upgrader', [MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]);
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


const towerAttack = function(tower) {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        console.log('Tower is attacking');
        tower.attack(closestHostile);
        return true;
    }
    return false;
};

const towerRepair = function(tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART
    });

    if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    } else {
        const damagedWalls = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < 300000 && 
                (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART)
        });
        if(damagedWalls.length > 0 && tower.energy > 700) {
            //var item = damagedWalls[Math.floor(Math.random()*damagedWalls.length)];
            const minHits = Math.min.apply(Math,damagedWalls.map(function(o){return o.hits;}));
            const item = damagedWalls.find(function(o){ return o.hits == minHits; });
            tower.repair(item);
        }
    }
};

module.exports.loop = function () {
// Garbage collect memory from dead creeps.
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    const tower = Game.getObjectById('58a84e66120c7b1c6451f132');
    if(tower) {
        if(!towerAttack(tower) && Game.time % 3 == 0) {
            towerRepair(tower);
        }
    } else {
        console.log('No tower found!');
    }

    if(Game.time % 10 ===0 && Game.spawns['Spawn1'].spawning === null)
    {
        const repairers = cntCreepsOfType('repairer');
        const harvesters = cntCreepsOfType('harvester');
        const upgraders = cntCreepsOfType('upgrader');
        const towerchargers = cntCreepsOfType('towercharger');
        const builders = cntCreepsOfType('builder');
        const upgraders2 = cntCreepsOfType('upgrader2');
        const upgraders3 = cntCreepsOfType('upgrader3');
        const harvesters2 = cntCreepsOfType('harvester2');
        const remoteMineAndBuilders = cntCreepsOfType('remoteMineAndBuilder');

        const constructionSitesE26S63 = Object.keys(Game.constructionSites).filter((siteKey) => {
            return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E26S63';
        });

        console.log('energy:' + Game.rooms['E26S63'].energyAvailable + 'repairers:' + repairers + ' harvesters:' + harvesters + ' upgraders:' + upgraders + ' builders:' + builders + ' towerchargers:'+ towerchargers+ 'upgraders2:' + upgraders2 + ' harvesters2:' + harvesters2);

        if(harvesters < 3 &&  Game.rooms['E26S63'].energyAvailable < 1000) {
            module.exports.makeHarvester();
        } else if(upgraders < 2) {
            module.exports.makeUpgrader();
        } else if(repairers < 0) {
            module.exports.makeRepairer();
        } else if(towerchargers < 2 && tower.energy < 900) {
            module.exports.makeTowercharger();
        } else if(harvesters2 < 2) {
            module.exports.makeHarvester2();  
        } else if(constructionSitesE26S63.length > 0 && builders < 0) {
            module.exports.makeBuilder();
        } else if(upgraders2 < 3) {
            module.exports.makeUpgrader2();
        } else if(/*constructionSitesE26S63.length == 0*/ upgraders3 < 1) {
            module.exports.makeUpgrader3();
        } else if(remoteMineAndBuilders < 2) {
            module.exports.makeRemoteMineAndBuilder();
        }
        
        if(harvesters == 0) {
            module.exports.makeSmallHarvester();    
        }

        
    } else {
//        console.log('Currently spawning..');
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
        if (creep.memory.role == 'remoteMineAndBuilder') {
            roleRemoteMineAndBuilder.run(creep);
            //    roleBuilder.run(creep);
        }
    }
};