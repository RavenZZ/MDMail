$(function () {
    $('#refresh').on('click', function () {
        G.socket.GenerateNew(function (id) {
            $('#mailName').val(id).trigger('change');
        });
    });
    $('#mailName').on('change', function () {
        var n = $(this).val();
        G.socket.ValidateName(n, function (result) {
            if (!result['err']) {
                var isExists = result['exists'];
                console.log(isExists)
                if (isExists) {
                    $('#btnBind').hide();
                } else {
                    $('#btnBind').show();
                }
            }
        });
    }).on('keyup', function () {
        var n = $(this).val();
        G.socket.ValidateName(n, function (result) {
            if (!result['err']) {
                var isExists = result['exists'];
                console.log(isExists);
                if (isExists) {
                    $('#btnBind').hide();
                } else {
                    $('#btnBind').show();
                }
            }
        });
    });

    $('#btnBind').on('click', function () {
        var ename = $('#mailName').val();
        $('.c').hide();
        G.socket.BindRelation(ename, function (result) {
            showTipMessage(ename);
        });
    });
});

var showTipMessage = function (ename) {
    $('#TipTitle').text('Now Send an email to:');
    $('#myMail').text(ename + G.domain).show();
};

var onNewMail = function (mailData) {
    $('#btnGo').show().on('click', function () {
        location.reload();
    });
    $('#myMail').text('Yeah~ Success! Subject is ' + mailData.subject);
};


