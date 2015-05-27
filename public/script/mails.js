$(function () {
    G.socket = new Socket(function () {
        G.socket.GetMails(1, function (datas) {
            console.dir(datas)
        })
    });
});




var generateHtml = function (mailsList) {

};
