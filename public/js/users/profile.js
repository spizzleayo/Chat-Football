$(document).ready(function () {
    $('.add-btn').on('click', function () {
        $('#add-input').click();
    });

    $('#add-input').on('change', function (event) {
        var addInput = $('#add-input');
        var imageFile = event.target.files[0];
        if (addInput.val() != '') {
            var formData = new FormData();
            // console.log(uploadInput[0]);
            // console.log(imageFile);
            formData.append('upload', imageFile);
            $('#completed').html('File uploaded successfully');
            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    addInput.val('');
                }
            });
        }
        ShowImage(this);
    });

    $('#profile').on('click', function () {
        let username = $('#username').val();
        let country = $('#country').val();
        let fullname = $('#fullname').val();
        let gender = $('#gender').val();
        let mantra = $('#mantra').val();
        let upload = $('#add-input').val();
        let image = $('#user-image').val();

        let valid = true;
        console.log(upload);
        if (upload == "") {
            $('#add-input').val(image);
        }
        if (username == "" || fullname == "" || country == "" || gender == ""
            || mantra == "") {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field</div>');
        } else {
            $('#error').html('');
        }
        if (valid) {
            $.ajax({

                url: 'settings/profile',
                type: 'POST',
                data: {
                    username: username,
                    fullname: fullname,
                    gender: gender,
                    country: country,
                    mantra: mantra,
                    upload: upload,
                },
                success: function () {
                    setTimeout(function () {
                        window.location.reload;
                    }, 200);
                }
            });
        } else {
            return false;
        }

    });

});

function ShowImage(input) {
    // console.log('input', input);
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            // console.log('e', e);
            $('#show_img').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}