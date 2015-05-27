var colors = require('colors');
var shortid = require('shortid');
var mongo = require('./mongo');
var db = new mongo();

var connection = function (io) {
    var _this = this;

    this.OnConnection = function (socket) {
        console.log(('connected socket.id ' + socket.id + ' userid ' + socket.UserID + ' projectid ' + socket.ProjectID).green);

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


    };

};


module.exports = connection;