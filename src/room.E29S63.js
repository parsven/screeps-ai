

const roleBuilder = require('./role.builder');


/*
 * Masterplan:
 *
 * Send one claimer
 *  (Spawn with: TODO! )
 *
 * Dismantling of spawn?
 *
 * Send two pathfind ==> harvest <--> build from Spawn1 [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY]
 *
 * Börja spawna upgraders, levla upp RCL.
 */

//const util = require('./util');

const roleRemoteClaim = require('./role.remoteClaim');
const roleAttackStructure = require('./role.attackStructure');
const roleUpgrader = require('./role.upgrader');
const roleUpgraderAt = require('./role.upgradeAt');

const roleHarvester2 = require('./role.harvester2');
const roleMiner2 = require('./role.miner2');
const roleEnergyLoader = require('./role.energyLoader');

const roleWallBuilder = require('./role.wallbuilder');
const roleContainerToContainer = require('./role.containerToContainer');


const constructionSitesE29S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E29S63';
});


const sourceUp = '57ef9dff86f108ae6e60ea0c';
const sourceDown = '57ef9dff86f108ae6e60ea0d';

const containerAtEnergySources = '58c57bb1fb47bdd51ad9cee4';
const posOfContainerAtEnergySources = new RoomPosition(44,45, 'E29S63');

const containerAtRoomController = '58c85fde1e264c583f4d254c';
const posOfContainerAtRoomController = new RoomPosition(27,30, 'E29S63');


const build = function(typ, body, taskName) {
    const name = taskName + '-' + Game.time;
    const spawn = Game.spawns['Spawn3'];
    const memory = {
        role: typ,
        spawnRoom: spawn.room.name,
        taskName: taskName
    };
    if( OK == spawn.canCreateCreep(body, name)) {
        const result = spawn.createCreep( body, name, memory );
        console.log('making ' + typ + ' res=' + result);
    } else {
        //  console.log('fail' + body + name);
    }
};


module.exports = {

    makeClaimer: () => {
        roleRemoteClaim.factory(Game.spawns['Spawn1'],
        [   new RoomPosition(48,25,'E26S63'),
            new RoomPosition(9,10, 'E27S63'),
            new RoomPosition(29,25, 'E27S63'),
            new RoomPosition(3,34, 'E28S63'),
            new RoomPosition(29,30, 'E29S63')
        ], '57ef9dff86f108ae6e60ea0b', 'ClaimTheShit')
    },
    makeAttacker: () => {
        roleAttackStructure.factory(Game.spawns['Spawn1'],
            [ATTACK, ATTACK, MOVE, MOVE, MOVE, WORK, CARRY, MOVE],
            [   new RoomPosition(48,25,'E26S63'),
                new RoomPosition(9,10, 'E27S63'),
                new RoomPosition(29,25, 'E27S63'),
                new RoomPosition(3,34, 'E28S63'),
                new RoomPosition(36,42, 'E29S63')
            ], '58a22f8cd25357e82541e75b', 'AttackTheShit')
    },


    roomName: 'E29S63',

    taskDefs: {
        Harvester: {
            factory: () => {
                build('harvester2', [MOVE, WORK, CARRY], "Harvester");
            }
        },

        Upgrader: {
            factory: () => {
                roleUpgrader.factory(Game.spawns['Spawn3'], [MOVE, MOVE, WORK, WORK, WORK, CARRY],
                    containerAtEnergySources, "Upgrader", Game.flags['hv2'].pos);
            }
        },

        WallBuilder: {
            factory: () => {
                roleWallBuilder.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                    containerAtEnergySources, 'aaaTTT', 'WallBuilder');
            }
        },

        Builder: {
            factory: () => {
                roleBuilder.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                    containerAtEnergySources, 'aaaTTT', 'Builder');
            }
        },

        Miner1: {
            factory: () => {
                roleMiner2.factory(Game.spawns['Spawn3'], [MOVE, MOVE, WORK, WORK, WORK, CARRY],
                    sourceUp, [new RoomPosition(44, 44, 'E29S63')], 'Miner1');
            }
        },
        Miner2: {
            factory: () => {
                roleMiner2.factory(Game.spawns['Spawn3'], [MOVE, MOVE, WORK, WORK, WORK, CARRY],
                    sourceDown, [new RoomPosition(45, 45, 'E29S63')], 'Miner2');
            }
        },
        UpgraderAt1: {
            factory: () => {
                roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn3'],
                    2,2,
                    containerAtRoomController,
                    '57ef9dff86f108ae6e60ea0b',
                    [new RoomPosition(28,30, 'E29S63')],
                    'UpgraderAt1');
            }
        },
        UpgraderAt2: {
            factory: () => {
                roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn3'],
                    2,2,
                    containerAtRoomController,
                    '57ef9dff86f108ae6e60ea0b',
                    [new RoomPosition(28,29, 'E29S63')],
                    'UpgraderAt2');
            }
        },
        UpgraderAt3: {
            factory: () => {
                roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn3'],
                    2,2,
                    containerAtRoomController,
                    '57ef9dff86f108ae6e60ea0b',
                    [new RoomPosition(27,29, 'E29S63')],
                    'UpgraderAt3');
            }
        },
        EnergyLoader: {
            factory: () => {
                const name = 'EnergyLoader-' + Game.time;
                const spawn = Game.spawns['Spawn3'];
                const memory = {
                    role: roleEnergyLoader.role,
                    containerLevel: 100,
                    containerId: containerAtEnergySources,
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
        Container2Container: {
            factory: () => {
                roleContainerToContainer.factory(Game.spawns['Spawn3'],
                    posOfContainerAtEnergySources, containerAtEnergySources,
                    posOfContainerAtRoomController, containerAtRoomController,
                [MOVE, MOVE, CARRY, CARRY], 'Container2Container');
            }
        }
    },

    desiredCreepers: {
        distribution: [
            {task: 'Harvester', cnt: 1, criteria: () => Game.rooms['E29S63'].find(FIND_CREEPS).length < 2},
            {task: 'EnergyLoader', cnt: 1, criteria: () => true},
            {task: 'Miner1', cnt: 1, criteria: () => true},
            {task: 'Miner2', cnt: 1, criteria: () => true},
            {task: 'Container2Container', cnt: 3, criteria: () => Game.getObjectById(containerAtRoomController).store[RESOURCE_ENERGY] < 1400},
//            {task: 'Upgrader', cnt: 3, criteria: () => true},
            {task: 'UpgraderAt1', cnt: 1, criteria: () => true},
            {task: 'UpgraderAt2', cnt: 1, criteria: () => Game.getObjectById(containerAtRoomController).store[RESOURCE_ENERGY] > 500},
            {task: 'UpgraderAt3', cnt: 1, criteria: () => Game.getObjectById(containerAtRoomController).store[RESOURCE_ENERGY] > 1000},
//            {task: 'WallBuilder', cnt: 1, criteria: () => true },
            {task: 'Builder', cnt: 1, criteria: () => constructionSitesE29S63().length > 0 }
        ]
    },

    makeBuilder1: () => {
        roleBuilder.factory(Game.spawns['Spawn1'], [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY], '57ef9dff86f108ae6e60ea0d', 'aaaTTT', "Builder1");
    },
    makeBuilder2: () => {
        roleBuilder.factory(Game.spawns['Spawn1'], [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY], '57ef9dff86f108ae6e60ea0c', 'hv2', "Builder2");
    },

    makeUpgrader: () => {
        roleBuilder.factory(Game.spawns['Spawn1'], [WORK, CARRY, MOVE],
            '57ef9dff86f108ae6e60ea0c','hv2', "Upgrader");
    }

};