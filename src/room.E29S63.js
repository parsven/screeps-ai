

const roleBuilder = require('./role.builder');


//122,631
//kl 2007

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
const role2StationaryTowerCharger = require('./role2.stationaryTowerCharger');
const role2DumpTo = require('./role2.dumpTo');
const role2StationaryEnergyTransfer = require('./role2.stationaryEnergyTransfer');
const role2StationaryDumpToLink = require('./role2.stationaryDumpToLink');
const roleMoveTo = require('./role.moveTo');

const towerLogic = require('./tower');


const constructionSitesE29S63 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E29S63';
});

const constructionSitesE29S64 = () => Object.keys(Game.constructionSites).filter((siteKey) => {
    return Game.constructionSites[siteKey].room && Game.constructionSites[siteKey].room.name === 'E29S64';
});

const sourceUp = '57ef9dff86f108ae6e60ea0c';
const sourceDown = '57ef9dff86f108ae6e60ea0d';

const storageId = '58cdafcc6fbc772560f2ba16';

const containerAtEnergySources = '58cc62e4833a2fe46d57d1a8';
const posOfContainerAtEnergySources = new RoomPosition(44,45, 'E29S63');
const posOfStorage = new RoomPosition(37,42, 'E29S63');

const containerAtRoomController = '58cc51e312a03d29648a358c';
const posOfContainerAtRoomController = new RoomPosition(27,30, 'E29S63');

const tower1Id = '58ca9ce9ad9fc25a25eb80e8';
const tower2Id = '58d024f582b79471740e8feb';

const linkAtStorage = '58d05ed766cb895a4a50e8fa';
const linkAtRoomController = '58d0704dd8291064133ce40e';
const linkAtSource = '58d6c003c2c77f8e748a251c';

const build = function(typ, body, taskName) {
    const name = taskName + '-' + Game.time;
    const spawn = Game.spawns['Spawn3'];
    const memory = {
        role: typ,
        spawnRoom: spawn.room.name,
        taskName: taskName
    };
    if( OK === spawn.canCreateCreep(body, name)) {
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
                    '57ef9dff86f108ae6e60ea0c', "Upgrader", Game.flags['hv2'].pos);
            }
        },

        WallBuilder: {
            factory: () => {
                roleWallBuilder.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                    containerAtRoomController, 'Flag133', 'WallBuilder');
            }
        },

        Builder: {
            factory: () => {
                roleBuilder.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY],
                    containerAtRoomController, 'Flag133', 'Builder');
            }
        },

        Miner1: {
            factory: () => {
                const name = roleMiner2.factory(Game.spawns['Spawn3'], [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY],
                    sourceUp, [new RoomPosition(44, 44, 'E29S63')], 'Miner1');
                role2StationaryDumpToLink.addAsAdditionalSecondaryRoleTo(name, linkAtSource)
            }
        },
        Miner2: {
            factory: () => {
                const name = roleMiner2.factory(Game.spawns['Spawn3'], [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY],
                    sourceDown, [new RoomPosition(45, 45, 'E29S63')], 'Miner2');
                role2StationaryDumpToLink.addAsAdditionalSecondaryRoleTo(name, linkAtSource)
            }
        },
        UpgraderAt1: {
            factory: () => {
                const name = roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn3'],
                    6,4,
                    containerAtRoomController,
                    '57ef9dff86f108ae6e60ea0b',
                    [new RoomPosition(28,30, 'E29S63')],
                    'UpgraderAt1');
                if(name) {
                    Memory.creeps[name].role2 = [role2StationaryTowerCharger.role2];
                    role2StationaryEnergyTransfer.addAsAdditionalSecondaryRoleTo(name, linkAtRoomController, containerAtRoomController);
                }
            }
        },
        UpgraderAt2: {
            factory: () => {
                const name = roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn3'],
                    5,4,
                    containerAtRoomController,
                    '57ef9dff86f108ae6e60ea0b',
                    [new RoomPosition(28,29, 'E29S63')],
                    'UpgraderAt2');
                if(name) {
                    Memory.creeps[name].role2 = [role2StationaryTowerCharger.role2];
                    role2StationaryEnergyTransfer.addAsAdditionalSecondaryRoleTo(name, linkAtRoomController, containerAtRoomController);
                }
            }
        },
        UpgraderAt3: {
            factory: () => {
                const name = roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn3'],
                    6,4,
                    containerAtRoomController,
                    '57ef9dff86f108ae6e60ea0b',
                    [new RoomPosition(27,29, 'E29S63')],
                    'UpgraderAt3');
                if(name) {
                    Memory.creeps[name].role2 = role2StationaryTowerCharger.role2;
                }
            }
        },
        EnergyLoader: {
            factory: () => {
            roleEnergyLoader.factory(Game.spawns['Spawn3'],
                [CARRY, CARRY, CARRY,MOVE, MOVE, MOVE],
                storageId,
                new RoomPosition(36,42, 'E29S63'),
                'EnergyLoader')
            }
        },
        Container2Container: {
            factory: () => {
                roleContainerToContainer.factory(Game.spawns['Spawn3'],
                    posOfStorage, storageId,
                    posOfContainerAtRoomController, containerAtRoomController,
                    [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY],
                    'Container2Container');
            }
        },
        SourceContainerToStorage: {
            factory: () => {
                const name = roleContainerToContainer.factory(Game.spawns['Spawn3'],
                    posOfContainerAtEnergySources,
                    containerAtEnergySources,
                    posOfStorage,
                    storageId,
                    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                    'SourceContainerToStorage');
                role2DumpTo.addAsSecondaryRoleTo(name, linkAtStorage);
            }
        },
        EnergyTransfer: {
            factory:() => {
                const name = roleMoveTo.factory(Game.spawns['Spawn3'], new RoomPosition(37,41,'E29S63'), 'EnergyTransfer');
                role2StationaryEnergyTransfer.addAsAdditionalSecondaryRoleTo(name, linkAtStorage, storageId, true);
            }
        },
        Upgrader1: {
            factory:() => {
                const sourceDown = '57ef9dff86f108ae6e60ea10';
                const harvestPosUp = new RoomPosition(38,9, 'E29S64');
                roleUpgrader.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],sourceDown, 'Upgrader1',harvestPosUp);
            }
        },
        RemoteBuilder: {
            factory: ()=> {
                Game.spawns['Spawn3'].createCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY],
                    "remoteBuild" + Game.time,
                    {role: 'remoteMineAndBuilder',
                        spawnRoom: Game.spawns['Spawn3'].room.name,
                        taskName: 'RemoteBuilder'
                    }

                );
            }
        },
        RemoteWallBuilder: {
            factory: () => {
                const sourceDown = '57ef9dff86f108ae6e60ea10';
                roleWallBuilder.factory(Game.spawns['Spawn3']
                , [MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                sourceDown,
                'Flag92',
                   'RemoteWallBuilder');
            }
        }
    },

    desiredCreepers: {
        distribution: [
            {task: 'Harvester', cnt: 2, criteria: () =>  Game.rooms['E29S63'].find(FIND_CREEPS).length < 2},
            {task: 'EnergyLoader', cnt: 1, criteria: () => true},
            {task: 'Miner1', cnt: 1, criteria: () => true},
            {task: 'Miner2', cnt: 1, criteria: () => true},
            {task: 'EnergyTransfer', cnt: 1, criteria: () => true},
   //         {task: 'Container2Container', cnt: 4, criteria: () => true }, //Game.getObjectById(containerAtRoomController).store[RESOURCE_ENERGY] < 1800},
     //       {task: 'Upgrader', cnt: 1, criteria: () => true},
      //      {task: 'SourceContainerToStorage', cnt:2, criteria: () => true},
            {task: 'UpgraderAt1', cnt: 1, criteria: () => true},
            {task: 'UpgraderAt2', cnt: 1, criteria: () => Game.getObjectById(containerAtRoomController).store[RESOURCE_ENERGY] > 1000},
            {task: 'UpgraderAt3', cnt: 1, criteria: () => Game.getObjectById(containerAtRoomController).store[RESOURCE_ENERGY] > 1800},
    //        {task: 'WallBuilder', cnt: 1, criteria: () => true },
            {task: 'Builder', cnt: 1, criteria: () => constructionSitesE29S63().length > 0 },

     //       {task: 'Upgrader1', cnt:2 , criteria: () =>true},
    //        {task: 'RemoteWallBuilder', cnt:1 ,criteria: ()=>true},
            {task: 'RemoteBuilder', cnt:2, criteria: ()=> constructionSitesE29S64().length > 0 }
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
    },



    towerRun: () => {
        const tower = Game.getObjectById(tower1Id);
        if (tower) {
            if (!towerLogic.towerAttack(tower) && Game.time % 2 === 0) {
                towerLogic.towerRepair(tower);
            }
        } else {
            console.log('No tower in this rooom!');
        }

        const tower2 = Game.getObjectById(tower2Id);
        if (tower2) {
            if (!towerLogic.towerAttack(tower2) && Game.time % 2 === 1) {
                towerLogic.towerRepair(tower2);
            }
        } else {
            console.log('No tower in this rooom!');
        }

        const linkSource = Game.getObjectById(linkAtSource);
        const linkStorage = Game.getObjectById(linkAtStorage);
        const linkController = Game.getObjectById(linkAtRoomController);
        if(linkSource.energy > 600 ) {
            if(linkController.energy < 500) {
                linkSource.transferEnergy(linkController);
            } else {
                linkSource.transferEnergy(linkStorage);
            }
        }

    }




};