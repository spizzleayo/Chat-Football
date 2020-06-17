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

    socket.on('loggedInUser', function (users) {
        let friends = $('.friend').text();
        let friend = friends.split('@');
        friend = friend.map(each => each.trim());
        friend = friend.filter(each => each != "");
        let name = $('#name-user').val();
        let ol = $('<div></div>');
        let arr = [];
        // console.log('frienddd', friends);
        console.log('frienddd', friend);

        for (let i = 0; i < users.length; i++) {
            console.log(friend.indexOf(users[0].name));
            if (friend.indexOf(users[i].name) > -1) {
                console.log(friend.indexOf(users[i].name));
                arr.push(users[i]);
                ol.append(users[i].name);
            }
        }
        // console.log(arr);
        // console.log('sas', ol.text());

        $('#numOfFriends').text('(' + arr.length + ')');
        $('.onlineFriends').html(ol);

    });
});