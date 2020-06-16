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

        socket.on('newFriendRequest', function (friend) {
            console.log(friend);
        });

        $('#add_friend').on('submit', function (e) {
            e.preventDefault();

            let receiverName = $('#receiverName').val();


            $.ajax({
                url: '/group/' + room,
                type: 'POST',
                data: {
                    receiver: receiverName,
                },
                success: function () {
                    socket.emit('friendRequest', {
                        receiver: receiverName,
                        sender: sender
                    }, function () {
                        console.log('Request Sent');
                    });
                }
            });
        });
    });
})