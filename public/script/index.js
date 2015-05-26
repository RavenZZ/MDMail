$(function () {
    $('#refresh').on('click', function () {
        G.socket.GenerateNew(function (id) {
            $('#mailName').val(id).trigger('change');
        });
    });
    $('#mailName').on('change', function () {
        var n = $(this).val();
        G.socket.ValidateName(n, function (result) {
            if(!result['err']){
                var isExists = result['exists'];
                console.dir(isExists);
            }
        });
    });


});