$(document).ready(function () {
    let socket = io();
    let room = $('#groupName').val();
    let sender = $('#sender').val();

    socket.on('connect', function () {
        console.log('yea! user connected');

        let params = {
            room: room
        };
        socket.emit('join', params, function () {
            console.log('user joined the channel ', params.room);
        });
    });

    $('#message-form').on('submit', function (e) {
        e.preventDefault();
        let msg = $('#msg').val();

        socket.emit('createMessage', {
            text: msg,
            room: room,
            from: sender
        }, function () {
            if (msg.length) {
                $('#msg').val("");
            }
        });

    });
    socket.on('newMessage', function (data) {
        // console.log(data.room);
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });
        $('#messages').append(message);

    });

});