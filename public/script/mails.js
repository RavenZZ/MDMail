$(function () {
    G.socket = new Socket(function () {
        G.socket.GetMails(1, function (datas) {
            generateHtml(datas);
            console.dir(datas)
        });
    }, function (mailData) {
        $('#newMsgTip').show();
        G.unread += 1;
        notifyMe(mailData);
    });

    $('#newMsgTip').on('click', function () {
        location.reload();
    });
});



setInterval(function () {
    var unread = G.unread;
    if (unread == 0) {
        document.title = G.Title;
    } else {
        document.title = '(' + unread + ') ' + G.Title;
    }
}, 100);


var generateHtml = function (mailsList) {
    generateItem(0, mailsList);
};

var generateItem = function (i, mailsList) {
    if (i == mailsList.length) {
        return;
    } else {
        var mailItem = mailsList[i];
        var mailObj = $('#template').clone().attr("id", "");
        mailObj.find('.fromName').text(mailItem.fromNickname);
        mailObj.find('.fromMail').text(mailItem.from).attr('href', mailItem.from);
        mailObj.find('.text').text(mailItem.mail.text);

        $('#Mails').append(mailObj);
        i++;
        mailObj.slideDown(100, function () {
            generateItem(i, mailsList);
        });
    }
};

function notifyMe(mail) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var options = {
            icon: 'https://www.mingdao.com/images/Logo_appMingDao.PNG'
        };
        var notification = new Notification(mail.from + '\n' + mail.subject, options);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var options = {
                    icon: 'https://www.mingdao.com/images/Logo_appMingDao.PNG'
                };
                var notification = new Notification(mail.from + '\n' + mail.subject, options);
            }
        });
    }

    // Finally, if the user has denied notifications and you
    // want to be respectful there is no need to bother them any more.
}
