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
            $('#reload').load(location.href + '#reload');

            $(document).on('click', '#accept_friend', function () {
                let senderId = $('#senderId').val();
                let senderName = $('#senderName').val();

                $.ajax({
                    url: '/group/' + room,
                    type: 'POST',
                    data: {
                        senderId: senderId,
                        senderName: senderName,
                    },
                    success: function () {
                        $(this).parent().eq(1).remove();
                    }
                });
                $('#reload').load(location.href + '#reload');
            });

            $(document).on('click', '#cancel_friend', function () {
                let user_id = $('#user_id').val();

                $.ajax({
                    url: '/group/' + room,
                    type: 'POST',
                    data: {
                        user_id: user_id
                    },
                    success: function () {
                        $(this).parent().eq(1).remove();
                    }
                });
                $('#reload').load(location.href + '#reload');
            });
        });

        $('#add_friend').on('submit', function (e) {
            e.preventDefault();

            let receiverName = $('#receiverName').val();

            $.ajax({
                url: '/group/' + room,
                type: 'POST',
                data: {
                    receiverName: receiverName,
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

        $('#accept_friend').on('click', function () {
            let senderId = $('#senderId').val();
            let senderName = $('#senderName').val();

            $.ajax({
                url: '/group/' + room,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName,
                },
                success: function () {
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + '#reload');
        });

        $('#cancel_friend').on('click', function () {
            let user_id = $('#user_id').val();

            $.ajax({
                url: '/group/' + room,
                type: 'POST',
                data: {
                    user_id: user_id
                },
                success: function () {
                    $(this).parent().eq(1).remove();
                }
            });
            $('#reload').load(location.href + '#reload');
        });
    });
})