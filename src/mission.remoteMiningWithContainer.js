


const _ = require('lodash');


function endMission(nameOfMission) {
    delete Memory.missions.remoteMiningWithContainer[nameOfMission];
}

function initMission(nameOfMission, sourceToMine, posOfSourceContainer, spawn, destContainer, sourceLevel) {

    const distanceFromSpawnToSource = spawn.pos.findPathTo(posOfSourceContainer).length;
    console.log("distanceFromSpawnToSource="+ distanceFromSpawnToSource);

    if(Memory['missions'] === undefined) {
        Memory.missions = {};
    }
    if(Memory.missions.remoteMiningWithContainer === undefined) {
        Memory.missions.remoteMiningWithContainer = {};
    }

    Memory.missions.remoteMiningWithContainer[nameOfMission] = {
        sourceToMine: sourceToMine,
        posOfSource: posOfSourceContainer,
        sourceContainerId: false,
        spawn:  spawn.name,
        destContainer: destContainer,
        sourceLevel: sourceLevel,
        distance: distanceFromSpawnToSource
    };

}


function findContainer(m) {
    const sourcePos = new RoomPosition(m.posOfSource.x, m.posOfSource.y, m.posOfSource.roomName);

/*    const room = Game.rooms[m.posOfSource.roomName];
    if(!room) {
        const container = Game.getObjectById(m.sourceContainerId);
        console.log("container:" + JSON.stringify(container, null,2));
        return container;
    }
*/
    const atSourcePos = Game.rooms[m.posOfSource.roomName].lookForAt(LOOK_STRUCTURES, sourcePos);
    if(atSourcePos && atSourcePos.length > 0) {
        const containerReady =  atSourcePos[0].structureType === STRUCTURE_CONTAINER;
        if(containerReady) {
            return atSourcePos[0];
        }
    }
}

function isContainerReady(mission) {
    if(mission.sourceContainerId) {
        return true;
    } else {

        if(!Game.rooms[mission.posOfSource.roomName]) {
            return false;
        }
        const sourcePos = new RoomPosition(mission.posOfSource.x, mission.posOfSource.y,mission.posOfSource.roomName);
        const atSourcePos = Game.rooms[mission.posOfSource.roomName].lookForAt(LOOK_STRUCTURES, sourcePos);
        if(atSourcePos && atSourcePos.length > 0) {
            const containerReady =  atSourcePos[0].structureType === STRUCTURE_CONTAINER;
            if(containerReady) {
                mission.sourceContainerId = atSourcePos[0].id;
                return true;
            }
        }
        return false;
    }
}

function mine(m) {
    const creep = Game.creeps[m.miner];
    if(creep) {
        const sourcePos = new RoomPosition(m.posOfSource.x, m.posOfSource.y,m.posOfSource.roomName);
        if(creep.pos.isEqualTo(sourcePos)) {
            //Do the mining here
            creep.harvest(Game.getObjectById(m.sourceToMine));

            // Se if container needs to be repaired
            const container = findContainer(m);
            if(creep.carry.energy > 0 && container && container.hits < 250000) {
                creep.repair(container);
            }
        } else {
            creep.moveTo(sourcePos);
        }
    } else {
        const name2 = "minerminer-" + Game.time;
        const name = Game.spawns[m.spawn].createCreep([WORK,WORK,WORK,MOVE, MOVE,MOVE,CARRY], name2, {role:'custom'});
        if(name === name2) {
            m.miner = name;
        }
    }
}

function transport(m) {
    const creep = Game.creeps[m.transporter];
    if(creep) {
        if(creep.memory.unloading && creep.carry.energy === 0) {
            creep.memory.unloading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.unloading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('🚧give to the base!');
        }
        if(creep.memory.unloading) {
            const destContainer = Game.getObjectById(m.destContainer);
            if(ERR_NOT_IN_RANGE === creep.transfer(destContainer, RESOURCE_ENERGY)) {
                creep.moveTo(destContainer, {reusePath: 1})
            }
        } else {
            const sourceContainer = findContainer(m);
            if(!sourceContainer) {
                const sourcePos = new RoomPosition(m.posOfSource.x, m.posOfSource.y,m.posOfSource.roomName);
                creep.moveTo(sourcePos);
            } else if(ERR_NOT_IN_RANGE === creep.withdraw(sourceContainer, RESOURCE_ENERGY)) {
                creep.moveTo(sourceContainer, {reusePath: 1})
            }
        }
    } else {
        const name2 = "transporter-" + Game.time;
        const name = Game.spawns[m.spawn].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE, CARRY, CARRY,CARRY,CARRY,CARRY], name2, {role:'custom'});
        if(name === name2) {
            m.transporter = name;
        }
    }
}


function buildContainer(m) {

    const harvestAndBuild = function(creep) {
        const cm = creep.memory;
        if(cm.building && creep.carry.energy === 0) {
            cm.building = false;
            creep.say('Mine!');
        }
        if(!cm.building && creep.carry.energy === creep.carryCapacity) {
            cm.building = true;
            creep.say('🚧Build!');
        }
        if(cm.building) {
            const sourcePos = new RoomPosition(m.posOfSource.x, m.posOfSource.y,m.posOfSource.roomName);
            const res = creep.build(sourcePos.lookFor(LOOK_CONSTRUCTION_SITES)[0]);
        } else {
            creep.harvest(Game.getObjectById(m.sourceToMine));
        }
    };



    if(m.containerBuilder && Game.creeps[m.containerBuilder]) {
        //Do the moving, harvesting and building magic here...
        const creep = Game.creeps[m.containerBuilder];
        const sourcePos = new RoomPosition(m.posOfSource.x, m.posOfSource.y,m.posOfSource.roomName);
        if(!creep.pos.isEqualTo(sourcePos)) {
            creep.moveTo(sourcePos);
        } else {
            if(m.buildSite) {
                if(m.buildSite.length ===0) {
                    m.buildSite = sourcePos.lookFor(LOOK_CONSTRUCTION_SITES);
                }
                harvestAndBuild(creep);
            } else {
                const res = sourcePos.createConstructionSite(STRUCTURE_CONTAINER);
                console.log("res of createConstructionSite=" +res);
                m.buildSite = sourcePos.lookFor(LOOK_CONSTRUCTION_SITES);
            }
        }
    } else {
        // Spawn a new builder/harvester
        const name2 = "containerbuilder-" + Game.time;
        const name = Game.spawns[m.spawn].createCreep([WORK,WORK,MOVE,MOVE,CARRY], name2, {role:'custom'});
        if(name === name2) {
            m.containerBuilder = name;
        }
    }
}


function run() {
    if(Memory.missions) {
        for (let k in Memory.missions.remoteMiningWithContainer) {
            const m = Memory.missions.remoteMiningWithContainer[k];
//            console.log("m=" + JSON.stringify(m, null, 2))
            if (isContainerReady(m)) {
                console.log("Container ready!!");
                if(m.containerBuilder) {
                    const creepName = m.containerBuilder;
                    m.containerBuilder = undefined;
                    m.miner = creepName;
                }
                mine(m);
                transport(m);
            } else {
                buildContainer(m);
            }
        }
    }
}
module.exports = {
    run: run,
    initMission: initMission,
    endMission: endMission
};

//require('./mission.remoteMiningWithContainer').initMission('harvestE24S63', '57ef9df086f108ae6e60e87b', new RoomPosition(33,26,'E24S63'), Game.spawns['Spawn2'], '58b8a643560dcd5b601230fa', 1500)
//require('./mission.remoteMiningWithContainer').endMission('harvestE24S63')