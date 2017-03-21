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
const role2DumpTo = require('./role2.dumpTo');
const role2StationaryEnergyTransfer = require('./role2.stationaryEnergyTransfer');

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


const dispatchSecondaryRoles = function(creep) {
    const role2 = creep.memory.role2;
    let roles2 = [role2];

    if(!role2) {
        return false;
    }
    if (_.isArray(role2)) {
        roles2 = role2;
    }

    for (let i = 0; i<roles2.length ; i++) {
        const r2 = roles2[i];
     //   console.log("r2" + r2);
        if (r2 == role2StationaryTowerCharger.role2) {
            if (role2StationaryTowerCharger.run(creep)) {
                return true;
            }
        } else if (r2 == role2DumpTo.role2) {
            if (role2DumpTo.run(creep)) {
                return true;
            }
        } else if(r2 == role2StationaryEnergyTransfer.role2) {
            if( role2StationaryEnergyTransfer.run(creep)) {
                return true;
            }
        }
    }
    return false;
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

            if(dispatchSecondaryRoles(creep)) {
                continue;
            }

            switch(creep.memory.role) {
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case roleEnergyLoader.role:
                    roleEnergyLoader.run(creep);
                    break;
                case 'harvesterRemote':
                    roleHarvesterRemote.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairer.run(creep);
                    break;
                case 'towercharger':
                    roleTowercharger.run(creep);
                    break;
                case 'remoteMineAndBuilder':
                    roleRemoteRepairAndBuilder.run(creep);
                    break;
                case 'claimer':
                    roleClaimer.run(creep);
                    break;
                case roleMiner.role:
                    roleMiner.run(creep);
                    break;
                case roleUpgradeAt.role:
                    roleUpgradeAt.run(creep);
                    break;
                case roleContainerToContainer.role:
                    roleContainerToContainer.run(creep);
                    break;
                case roleAttackStructure.role:
                    roleAttackStructure.run(creep);
                    break;
                case roleRemoteClaim.role:
                    roleRemoteClaim.run(creep);
                    break;
                case roleHarvester2:
                    roleHarvester2.run(creep);
                    break;
                case roleWallbuilder.role:
                    roleWallbuilder.run(creep);
                    break;
                case roleMiner2.role:
                    roleMiner2.run(creep);
                    break;
                case roleMineralhauler.role:
                    roleMineralhauler.run(creep);
                    break;
            }
        } catch (err) {
            console.log(err + err.stack);
        }
    }
};