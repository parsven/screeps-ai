module.exports = {
    build: function(typ, body, taskName) {
        const name = taskName + '-' + Game.time;
        const spawn = Game.spawns['Spawn1'];
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
    }

};