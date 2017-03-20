/**
 * Created by parsvensson on 2017-03-18.
 */


const _ = require('lodash');

module.exports= {
    role2: 'stationaryTowerCharger',
    run: function(creep) {
        const towers = creep.pos.findInRange(FIND_MY_STRUCTURES,1, {
            filter: { structureType: STRUCTURE_TOWER }});
        const towersNeedingEnergy = _.filter(towers, (t) => t.energy<951);
        if(towersNeedingEnergy.length > 0) {
            const tower = towersNeedingEnergy[0];
            return OK == creep.transfer(tower, RESOURCE_ENERGY);
        } else {
            return false;
        }
    }
};