var colors = require('colors');
var shortid = require('shortid');
var mongo = require('./mongo');
var db = new mongo();

var connection = function (io) {
    var _this = this;

    this.OnConnection = function (socket) {
        console.log(('connected socket.id ' + socket.id + ' userid ' + socket.UserID + ' projectid ' + socket.ProjectID).green);
        socket.join(socket.UserID);

        socket.on('generate new', function (data, callback) {
            callback({
                name: shortid.generate()
            })
        });

        socket.on('validate name', function (data, callback) {
            var name = data.name;
            db.checkUnique(name, function (err, result) {
                var returnObj = {};
                if (err) {
                    returnObj['err'] = result;
                } else {
                    var isExists = result == null ? 0 : 1;
                    returnObj['exists'] = isExists;
                }
                callback(returnObj);
            });
        });

        socket.on('add relation', function (data, callback) {
            var uid = socket.UserID;
            var pid = socket.ProjectID;
            var ename = data.ename;

            db.addRelation(uid, pid, ename, function (err, result) {
                callback(result);
            });
        });

        socket.on('mails', function (data, callback) {
            var uid = socket.UserID;
            var pageIndex = data.i;
            callback(getTestData());
            //db.getMailList(uid,pageIndex, function (err, result) {
            //    callback(result);
            //});
        });


    };

};

function getTestData() {
    var mails = [];
    for (var i = 0; i < 20; i++) {
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
        mails.push(m);
    }
    return mails;
}


module.exports = connection;