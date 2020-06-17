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
    });
};