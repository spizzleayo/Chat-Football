$(document).ready(function () {
    let socket = io();
    let paramOne = $.deparam(window.location.pathname);

    let newParam = paramOne.split('.');

    let username = newParam[0];
    $('#receiver_name').text('@' + username);

    swap(newParam, 0, 1);
    let paramTwo = newParam[0] + '.' + newParam[1];

    socket.on('connect', () => {
        let params = {
            room1: paramOne,
            room2: paramTwo
        };
        socket.emit('join PM', params);
    });

    socket.on('new message', (data) => {
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });
        $('#messages').append(message);
    });

    $('#message_form').on('submit', function (e) {
        e.preventDefault();
        let msg = $('#msg').val();
        let sender = $('#name-user').val();

        if (msg.trim().length > 0) {
            socket.emit('private message', {
                text: msg,
                sender: sender,
                room: paramOne
            }, () => {
                $('#msg').val('');
            });
        }

    });

    $('#send-message').on('click', function () {
        let message = $('#msg').val();
        $.ajax({
            url: '/chat/' + paramOne,
            type: 'POST',
            data: {
                message: message
            },
            success: function () {
                $('#msg').val("");
            }
        });
    });


});
function swap(input, value_1, value_2) {
    let temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
}