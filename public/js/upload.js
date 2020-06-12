$(document).ready(function () {
    $('upload-btn').on('click', function () {
        $('#upload-input').click();
    });

    $('#upload-input').on('change', function (event) {
        var uploadInput = $('#upload-input');
        var imageFile = event.target.files[0];
        if (uploadInput.val() != '') {
            var formData = new FormData();
            // console.log(uploadInput[0]);
            formData.append('upload', imageFile);
            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    uploadInput.val('');
                }
            });
        }
    });
})