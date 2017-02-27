

const towerAttack = function(t) {
    const closestHostile = t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        console.log('Tower is attacking');
        t.attack(closestHostile);
        return true;
    }
    return false;
};

const towerRepair = function(t) {
    const closestDamagedStructure = t.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.hits < structure.hitsMax &&
                structure.structureType !== STRUCTURE_WALL &&
                structure.structureType !== STRUCTURE_RAMPART;
        }
    });

    if(closestDamagedStructure) {
        //   console.log("Repairing damaged strcure of type:" + closestDamagedStructure.structureType);
        t.repair(closestDamagedStructure);
    } else if(t.energy > 820) {
        const damagedWalls = t.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.hits < 300000 &&
                    (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART)
            }
        });
        if(damagedWalls.length > 0) {
            //var item = damagedWalls[Math.floor(Math.random()*damagedWalls.length)];
            const minHits = Math.min.apply(Math,damagedWalls.map(function(o){return o.hits;}));
            const item = damagedWalls.find(function(o){ return o.hits == minHits; });
            //           console.log("My energy is:" + t.energy + " reinforcing:" + item.structureType);
            t.repair(item);
        } else {
            //    console.log("My energy is:" + t.energy + " no action taken!");
        }
    }
};

module.exports = {
    towerAttack: towerAttack ,
    towerRepair: towerRepair
};