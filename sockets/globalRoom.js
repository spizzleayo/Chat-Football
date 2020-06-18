const { Socket } = require("socket.io");

module.exports = function (io, Global) {
    const users = new Global;
    io.on('connection', (socket) => {
        socket.on('global room', (global) => {
            socket.join(global.room);
        });
    });
};