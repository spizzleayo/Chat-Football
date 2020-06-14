module.exports = function (io, Users) {

    const users = new Users();

    io.on('connection', (socket) => {

        socket.on('join', (data, callback) => {
            socket.join(data.room);

            users.AddUserData(socket.id, data.name, data.room);
            // console.log(users);
            io.to(data.room).emit('usersList', users.GetUsersList(data.room));
            callback();
        });

        socket.on('createMessage', (message, callback) => {
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.from
            });
            callback();
        });

        socket.on('disconnect', () => {
            let user = users.RemoveUser(socket.id);

            if (user) {
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        });

    });
};