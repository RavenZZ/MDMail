var async = require('async');
var mongo = require('./lib/mongo');
var db = new mongo;

var mails = [];

var m1 = {
    from: 'zhuyingjunjun@foxmail.com',
    fromNickname: 'Raven',
    to: 'raven.zhu@sender.mingdao.com',
    uid: 'bb4c7fd9-5a9e-419d-946b-efe70530b974',
    subject: '标题',
    mail: {
        html: '<div>我是正文Body</div>',
        text: '我是正文Body',
        attachments: []
    }
};

for (var i = 0; i < 50; i++) {
    mails.push(i);
}


async.eachSeries(mails, function (i, ok) {
    var m = {
        from: 'zhuyingjunjun@foxmail.com',
        fromNickname: 'Raven',
        to: 'raven.zhu@sender.mingdao.com',
        uid: 'bb4c7fd9-5a9e-419d-946b-efe70530b974',
        subject: '标题'+i,
        mail: {
            html: '<div>我是正文Body'+i+'</div>',
            text: '我是正文Body'+i,
            attachments: []
        },
        time:new Date()
    };
    db.addMail(m.from, m.fromNickname, m.to, m.uid, m.subject, m.mail, function (err,result) {
        console.dir(result)
        setTimeout(function () {
            ok();
        },1000);
    });

}, function (err) {
    console.log('the end');
});



//db.addMail()
