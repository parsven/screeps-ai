module.exports = {
    build: function(typ, body, roleName) {
        const name = roleName + '-' + Game.time;
        const spawn = Game.spawns['Spawn1'];
        const memory = {
            role: typ,
            spawnRoom: spawn.room.name,
            roleName: roleName
        };
        if( OK == spawn.canCreateCreep(body, name)) {
            const result = spawn.createCreep( body, name, memory );
            console.log('making ' + typ + ' res=' + result);
        } else {
            //  console.log('fail' + body + name);
        }
    }

};