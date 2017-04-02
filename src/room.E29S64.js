

const roleRemoteClaim = require('./role.remoteClaim');
const roleUpgrader = require('./role.upgrader');
const roleRemoteBuild = require('./role.remoteRepairAndBuild');
const roleMiner2 = require('./role.miner2');
const roleEnergyLoader = require('./role.energyLoader');
const roleContainer2Container = require('./role.containerToContainer');
const roleUpgraderAt = require('./role.upgradeAt');

const towerLogic = require('./tower');

const roomController = '57ef9dff86f108ae6e60ea11';

const sourceUp = '57ef9dff86f108ae6e60ea0f';
const harvestPosUp = new RoomPosition(36,4, 'E29S64');
const loadPosUp = new RoomPosition(35,5, 'E29S64');
const containerAtSourceUp = '58df238965dedc7d8fd60c38';

const sourceDown = '57ef9dff86f108ae6e60ea10';
const harvestPosDown = new RoomPosition(38,9, 'E29S64');
const loadPosDown = new RoomPosition(39,9, 'E29S64');
const containerAtSourceDown = '58dff4467202bb2e668699f1';


const tower1 ='58df0ae5ec67cb0b611a11f4';

const containerAtRoomController = '58e0181dc2ae9ed8685dae7e';
const containerAtRoomControllerPos = new RoomPosition(33,22,'E29S64');

const upgraderAt1Pos = new RoomPosition(32,23,'E29S64');
const upgraderAt2Pos = new RoomPosition(33,23,'E29S64');
const upgraderAt3Pos = new RoomPosition(34,23,'E29S64');

module.exports = {

    makeClaimer: () => {
        roleRemoteClaim.factory(Game.spawns['Spawn3'],
            [   new RoomPosition(46,23,'E29S63'),
                new RoomPosition(15,25, 'E30S63'),
                new RoomPosition(6,14, 'E30S64'),
                new RoomPosition(33,26, 'E29S64')
            ], '57ef9dff86f108ae6e60ea0b', 'ClaimTheShit')
    },


    makeRemoteUpgrader1: () => {
        roleUpgrader.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],sourceUp, 'Upgrader1',harvestPosUp);
    },
    makeRemoteUpgrader2: () => {
        roleUpgrader.factory(Game.spawns['Spawn3'], [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],sourceDown, 'Upgrader2',harvestPosDown);
    },

    makeRemoteBuild: () => {
        Game.spawns['Spawn3'].createCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY],
            "remoteBuild" + Game.time,
            {role: 'remoteMineAndBuilder'});
    },

    taskDefs: {
        Miner1: {
            factory: () => {
               roleMiner2.factory(Game.spawns['Spawn4'],[MOVE,MOVE,WORK,WORK,WORK,WORK],sourceUp, [harvestPosUp],'Miner1')
            }
        },
        Miner2: {
            factory: () => {
                roleMiner2.factory(Game.spawns['Spawn4'],[MOVE,MOVE,MOVE, WORK, WORK,WORK,WORK,WORK],sourceDown, [harvestPosDown],'Miner2')
            }
        },
        EnergyLoader: {
            factory: () => {
                const name = roleEnergyLoader.factory(Game.spawns['Spawn4'],
                    [CARRY, CARRY, MOVE, MOVE],
                    containerAtRoomController,
                    containerAtRoomControllerPos,
                    'EnergyLoader');
                if(name) {
                    Memory.creeps[name].containerLevel = 1;
                }
            }
        },
        Container1ToContainer: {
            factory: () => {
                roleContainer2Container.factory(Game.spawns['Spawn4'],
                harvestPosUp,containerAtSourceUp, containerAtRoomControllerPos, containerAtRoomController,
                    [MOVE,MOVE,CARRY,CARRY,CARRY],'Container1ToContainer');
            }
        },
        Container2ToContainer: {
            factory: () => {
                roleContainer2Container.factory(Game.spawns['Spawn4'],
                    harvestPosDown,containerAtSourceDown, containerAtRoomControllerPos, containerAtRoomController,
                    [MOVE,MOVE,CARRY,CARRY,CARRY],'Container2ToContainer');
            }
        },
        UpgraderAt1: {
            factory: () => {
                roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn4'],
                4,2,containerAtRoomController,roomController, [upgraderAt1Pos],'UpgraderAt1');
            }
        },
        UpgraderAt2: {
            factory: () => {
                roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn4'],
                    4,2,containerAtRoomController,roomController, [upgraderAt2Pos],'UpgraderAt2');
            }
        },
        UpgraderAt3: {
            factory: () => {
                roleUpgraderAt.factory(roleUpgraderAt.role, Game.spawns['Spawn4'],
                    4,2,containerAtRoomController,roomController, [upgraderAt3Pos],'UpgraderAt3');
            }
        }

    },
    desiredCreepers: {
        distribution: [
            {task: 'EnergyLoader', cnt:1, criteria: () => true},
            {task: 'Container1ToContainer', cnt:2, criteria: () => true},
            {task: 'Container2ToContainer', cnt:3, criteria: () => true},
            {task: 'Miner1', cnt: 1, criteria: () => true},
            {task: 'Miner2', cnt: 1, criteria: () => true},
            {task: 'UpgraderAt1', cnt: 1, criteria: ()=>true},
            {task: 'UpgraderAt2', cnt: 1, criteria: ()=>true},
            {task: 'UpgraderAt3', cnt: 1, criteria: ()=>true}
        ]
    },



    towerRun: () => {
        const tower = Game.getObjectById(tower1);
        if (tower) {
            if (!towerLogic.towerAttack(tower) && Game.time % 2 === 0) {
                towerLogic.towerRepair(tower);
            }
        } else {
            console.log('No tower in this rooom!');
        }
/*
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
*/
    }



};


//require('./room.E29S64').makeRemoteBuild();