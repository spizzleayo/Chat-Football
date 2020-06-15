$(document).ready(function () {
    let socket = io();
    let room = $('#groupName').val();
    let sender = $('#sender').val();

    socket.on('connect', () => {
        let params = {
            sender: sender
        };

        socket.emit('joinRequest', params, function () {
            console.log('Joined');
        });
    });
})