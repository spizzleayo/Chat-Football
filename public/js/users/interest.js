$(document).ready(function () {
    $('#favClubBtn').on('click', function () {
        let favClub = $('#favClub').val();
        let valid = true;
        if (favClub == '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field.</div>');
        } else {
            $('#error').html('');
        }

        if (valid) {
            $.ajax({
                url: 'settings/interest',
                type: 'POST',
                data: { favClub: favClub },
                success: function () {
                    setTimeout(function () {
                        window.location.reload();
                    }, 200);
                }
            });
        } else {
            return false;
        }

    });
    $('#favPlayerBtn').on('click', function () {
        let favPlayer = $('#favPlayer').val();
        let valid = true;
        if (favPlayer == '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field.</div>');
        } else {
            $('#error').html('');
        }

        if (valid) {
            $.ajax({
                url: 'settings/interest',
                type: 'POST',
                data: { favPlayer: favPlayer },
                success: function () {
                    setTimeout(function () {
                        window.location.reload();
                    }, 200);
                }
            });
        } else {
            return false;
        }

    });
    $('#nationalTeamBtn').on('click', function () {
        let nationalTeam = $('#nationalTeam').val();
        let valid = true;
        if (nationalTeam == '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field.</div>');
        } else {
            $('#error').html('');
        }

        if (valid) {
            $.ajax({
                url: 'settings/interest',
                type: 'POST',
                data: { nationalTeam: nationalTeam },
                success: function () {
                    setTimeout(function () {
                        window.location.reload();
                    }, 200);
                }
            });
        } else {
            return false;
        }

    });
});