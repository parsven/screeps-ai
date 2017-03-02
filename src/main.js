const roleHarvester = require('role.harvester');
const roleHarvester2 = require('role.harvester2');
const roleHarvester3 = require('role.harvester3');
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
const roleUpgradeAt = require('role.upgradeAt');
const roleContainerToContainer = require('./role.containerToContainer');

const roomE26S63 = require('room.E26S63');
const roomE25S63 = require('room.E25S63');

const util = require('util');

const _ = require('lodash');

const cntCreepsOfType = function (t, roomName) {
    return _.filter(Game.creeps, function (o) {
        return o.memory.taskName == t;// && o.memory.spawnRoom == roomName;
    }).length;
};


const makeSmallHarvester = function() {
    util.build('harvester', [WORK, CARRY, MOVE]);
};


const spawnLogic = function(spawnRoom, spawn) {

    let spawnCandidate;
    let str = "";

    for( let i in spawnRoom.desiredCreepers.distribution ) {
        const r = spawnRoom.desiredCreepers.distribution[i];
        const role = spawnRoom.roleDefs[r.role];
        if(role === undefined) {
            console.log("role:" + r.role + " is undefined!");
        }

        const currentCnt = cntCreepsOfType(r.role, spawn.room.name);
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
        const factory = spawnRoom.roleDefs[spawnCandidate].factory;
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

    if(Game.time % 10 === 0 && Game.spawns['Spawn1'].spawning === null)
    {
        let logStr = "======== E26S63 =================\n"
            + spawnLogic(roomE26S63, Game.spawns['Spawn1']);
        console.log(logStr);
        if(cntCreepsOfType('harvester') == 0) {
//            makeSmallHarvester();
        }
    }

    if(Game.time % 10 === 1 && Game.spawns['Spawn2'].spawning === null)
    {
        let logStr = "======== E25S63 =================\n"
            + spawnLogic(roomE25S63, Game.spawns['Spawn2']);
        console.log(logStr);
        if(cntCreepsOfType('harvester') == 0) {
  //          makeSmallHarvester();
        }
    }

    roomE26S63.towerRun();
    roomE25S63.towerRun();

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];

        if(Game.time % 3 ===0) {
            creep.say(creep.memory.taskName);
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'harvester2') {
            roleHarvester2.run(creep);
        }
        if (creep.memory.role == 'harvester3') {
            roleHarvester3.run(creep);
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
        if (creep.memory.role.substring(0,9) === roleUpgradeAt.role) {
            roleUpgradeAt.run(creep);
        }
        if(creep.memory.role == roleContainerToContainer.role) {
            roleContainerToContainer.run(creep);
        }
    }
};