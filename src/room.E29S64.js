

const roleRemoteClaim = require('./role.remoteClaim');
const roleUpgrader = require('./role.upgrader');
const roleRemoteBuild = require('./role.remoteRepairAndBuild');
const roleMiner2 = require('./role.miner2');
const roleEnergyLoader = require('./role.energyLoader');
const towerLogic = require('./tower');

const roomController = '57ef9dff86f108ae6e60ea11';

const sourceUp = '57ef9dff86f108ae6e60ea0f';
const harvestPosUp = new RoomPosition(36,4, 'E29S64');
const containerAtSourceUp = '58df238965dedc7d8fd60c38';

const sourceDown = '57ef9dff86f108ae6e60ea10';
const harvestPosDown = new RoomPosition(38,9, 'E29S64');


const tower1 ='58df0ae5ec67cb0b611a11f4';

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
        EnergyLoader: {
            factory: () => {
                const name = roleEnergyLoader.factory(Game.spawns['Spawn4'],
                    [CARRY, CARRY, MOVE, MOVE],
                    containerAtSourceUp,
                    harvestPosUp,
                    'EnergyLoader');
                if(name) {
                    Memory.creeps[name].containerLevel = 1;
                }
            }
        }

    },
    desiredCreepers: {
        distribution: [
            {task: 'EnergyLoader', cnt:3, criteria: () => true},
            {task: 'Miner1', cnt: 1, criteria: () => true}
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