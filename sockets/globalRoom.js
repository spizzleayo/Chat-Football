module.exports = function (io, Global, _) {
    const clients = new Global;
    io.on('connection', (socket) => {
        socket.on('global room', (global) => {
            socket.join(global.room);

            clients.EnterRoom(socket.id, global.name, global.room, global.img);

            let nameProp = clients.GetRoomList(global.room);
            const arr = _.uniqBy(nameProp, 'name');

            io.to(global.room).emit('loggedInUser', arr);

        });

        socket.on('disconnect', function () {
            const user = clients.RemoveUser(socket.id);
            if (user) {
                let userData = clients.GetRoomList(user.room);
                // console.log('userddataa', userData);
                const arr = _.uniqBy(userData, 'name');
                // console.log('arr', arr);
                const removeData = _.remove(arr, { 'name': user.name });
                // console.log('removee', removeData);
                io.to(user.room).emit('loggedInUser', arr);
            }
        });
    });
};