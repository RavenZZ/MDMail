var mongoose = require('mongoose');
var schema = require('./dataSchema');

var config = require('../configuration');

var client = mongoose.createConnection(config.mongodb.host, config.mongodb.database, config.mongodb.port);

var relationModel = client.model('relation', schema.relation);
var mailModel = client.model('mail', schema.mail);


var mongo = function () {
    var _this = this;
    var _callback;

    this.getRelation = function (uid, pid, callback) {
        var query = {
            uid: uid,
            pid: pid
        };

        relationModel.findOne(query, 'uid pid ename', function (err, relation) {
            if (err) {
                callback(1, err);
            } else {
                callback(0, relation);
            }
        });
    };

    this.checkUnique = function (ename, callback) {
        var query = {
            ename: ename
        };

        relationModel.findOne(query, '', function (err, relation) {
            if (err) {
                callback(1, err);
            } else {
                callback(0, relation);
            }
        });
    };

    this.addRelation = function (uid, pid, ename, callback) {
        var query = {
            uid: uid,
            pid: pid
        };
        var option = {
            upsert: true
        };
        var relation = {
            uid: uid,
            pid: pid,
            ename: ename
        };

        relationModel.findOneAndUpdate(query, relation, option, function (err, result) {
            if (err) {
                callback(1, err);
            } else {
                callback(0, result);
            }
        });
    };


    this.addMail = function (from, fromNickName, to, uid, subject, mail, callback) {
        var m = {
            from: from,
            fromNickname: fromNickName,
            to: to,
            uid: uid,
            mail: mail,
            subject:subject
        };

        var mailDocument = new mailModel(m);

        mailDocument.save(function (err, result, num) {
            if (err) {
                callback(1, err);
            } else {
                callback(0, num);
            }
        });
    };

    this.getMailList = function (uid, pageIndex, callback) {
        var conditions = {
            uid: uid
        };
        var limit = 20;
        var skip = (pageIndex - 1) * limit;
        var options = {
            limit: limit,
            skip: skip,
            sort: {time: -1}
        };

        mailModel.find(conditions, null, options, function (err, result) {
            if (err) {
                callback(1, err);
            } else {
                callback(0, result);
            }
        });
    };


};


module.exports = mongo;


























