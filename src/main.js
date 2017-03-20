const roleHarvester = require('./role.harvester');
const roleEnergyLoader = require('./role.energyLoader');
const roleHarvesterRemote = require('./role.harvesterRemote');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');
const roleRepairer = require('./role.repairer');
const roleTowercharger = require('./role.towercharger');
const roleRemoteRepairAndBuilder = require('./role.remoteRepairAndBuild');
const roleClaimer = require('./role.claimer');
const roleMiner = require('./role.miner');
const roleMiner2 = require('./role.miner2');
const roleUpgradeAt = require('./role.upgradeAt');
const roleContainerToContainer = require('./role.containerToContainer');
const roleAttackStructure = require('./role.attackStructure');
const roleRemoteClaim = require('./role.remoteClaim');
const roleMineralhauler = require('./role.mineralhauler');

const roleHarvester2 = require('./role.harvester2');
const roleWallbuilder = require('./role.wallbuilder');
const role2StationaryTowerCharger = require('./role2.stationaryTowerCharger');

const roomE26S63 = require('./room.E26S63');
const roomE25S63 = require('./room.E25S63');
const roomE29S63 = require('./room.E29S63');

const util = require('./util');

const _ = require('lodash');



// TODO: Taskname i taskDefs, skicka som en parameter till factory istället för att hårdkoda.




//todo: rename Source2ContainerToUpgradeContainer to Source2Container_To_UpgradeContainer

// Todo: om en invasion innehåller två creeps, varav en healer, måste de två tornen skjuta på varsitt mål!
// Todo: om invasion, se till att tanka tornen från tanken!
// Helt enkelt, inför en 'under siege'-strategi, och ha regler som bestämmer vilken strategi tornen ska ha i olika scenrier..

// TODO: Skriva funtioner för att byta roll på en creep, dvs en factory som istället för att göra en ny creep, byter memory på den.

// TODO: Göra så att energyLoader plockar upp energi på marken om in range.
// TODO: Låt energyLoader ha ett mergency-mode som aktiveras om tornen är < threshold, och hämtar då energi från tanken.



const cntCreepsOfType = function (t, roomName) {
    return _.filter(Game.creeps, function (o) {
        return o.memory.taskName == t && o.memory.spawnRoom == roomName;
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
        const role = spawnRoom.taskDefs[r.task];
        if(role === undefined) {
            console.log("role:" + r.task + " is undefined!");
        }

        const currentCnt = cntCreepsOfType(r.task, spawn.room.name);
        const line = "[" + currentCnt + "/" + r.cnt + "] " + r.task;
        if(r.criteria()) {
            str = str + "  " + line +"\n";
            if(!spawnCandidate && currentCnt < r.cnt) {
                spawnCandidate = r.task;
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
        const factory = spawnRoom.taskDefs[spawnCandidate].factory;
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

    if(Game.time % 10 === 1 && Game.spawns['Spawn3'].spawning === null)
    {
        let logStr = "======== E29S63 =================\n"
            + spawnLogic(roomE29S63, Game.spawns['Spawn3']);
        console.log(logStr);
        if(cntCreepsOfType('harvester') == 0) {
            //          makeSmallHarvester();
        }
    }

    roomE26S63.towerRun();
    roomE25S63.towerRun();
    roomE29S63.towerRun();

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];

        if(Game.time % 3 ===0) {
            creep.say(creep.memory.taskName);
        }

        try {
            if(creep.memory.role2 == role2StationaryTowerCharger.role2) {
                if(role2StationaryTowerCharger.run(creep)) {
                    continue;
                }
            }

            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role == roleEnergyLoader.role) {
                roleEnergyLoader.run(creep);
            }
            if (creep.memory.role == 'harvesterRemote') {
                roleHarvesterRemote.run(creep);
            }
            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
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
            if(creep.memory.role == roleAttackStructure.role) {
                roleAttackStructure.run(creep);
            }
            if(creep.memory.role == roleRemoteClaim.role) {
                roleRemoteClaim.run(creep);
            }
            if(creep.memory.role == roleHarvester2.role) {
                roleHarvester2.run(creep);
            }
            if(creep.memory.role == roleWallbuilder.role) {
                roleWallbuilder.run(creep);
            }
            if(creep.memory.role == roleMiner2.role) {
                roleMiner2.run(creep);
            }
            if(creep.memory.role == roleMineralhauler.role) {
                roleMineralhauler.run(creep);
            }
        } catch (err) {
            console.log(err + err.stack);
        }
    }
};