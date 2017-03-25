






function initMission(nameOfMission, sourceToMine, posOfSourceContainer, spawn, destContainer, sourceLevel) {

    const distanceFromSpawnToSource = spawn.pos.findPathTo(posOfSource).length;
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
        spawn:  spawn.id,
        destContainer: destContainer,
        sourceLevel: sourceLevel,
        distance: distanceFromSpawnToSource
    };

}


function isContainerReady() {


}

function run() {
    for(m in Memory.missions.remoteMiningWithContainer) {
        if(isContainerReady()) {

        } else {
            buildContainer();
        }
    }


}