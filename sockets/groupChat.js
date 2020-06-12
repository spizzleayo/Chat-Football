module.exports = function (io) {
    io.on('connection', (socket) => {

        socket.on('join', (data, callback) => {
            socket.join(data.room);
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



    });
};