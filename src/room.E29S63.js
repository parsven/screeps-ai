

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

const roleHarvester2 = require('./role.harvester2');
const roleMiner2 = require('./role.miner2');
const roleEnergyLoader = require('./role.energyLoader');

const roleWallBuilder = require('./role.wallbuilder');


const constructionSitesE29S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E29S63';
});


const sourceUp = '57ef9dff86f108ae6e60ea0c';
const sourceDown = '57ef9dff86f108ae6e60ea0d';

const containerAtEnergySources = '58c57bb1fb47bdd51ad9cee4';

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
        }
    },

    desiredCreepers: {
        distribution: [
            {task: 'Harvester', cnt: 1, criteria: () => Game.rooms['E29S63'].find(FIND_CREEPS).length < 2},
            {task: 'EnergyLoader', cnt: 1, criteria: () => true},
            {task: 'Miner1', cnt: 1, criteria: () => true},
            {task: 'Miner2', cnt: 1, criteria: () => true},
            {task: 'Upgrader', cnt: 3, criteria: () => true},
            {task: 'WallBuilder', cnt: 1, criteria: () => true },
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