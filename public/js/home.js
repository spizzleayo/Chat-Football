$(document).ready(function () {
    let id = $('#id').val();
    let clubName = $('#clubName').val();

    $('#favorite').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                clubName: clubName
            },
            success: function () {
                console.log(clubName);
            }
        });
    });

})