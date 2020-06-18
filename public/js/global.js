$(document).ready(function () {
    let socket = io();

    socket.on('connect', function () {
        let room = 'GlobalRoom';
        let name = $('#name-user').val();
        let img = $('#name-img').val();

        socket.emit('global room', {
            room: room,
            name: name,
            img: img
        });
    });
})