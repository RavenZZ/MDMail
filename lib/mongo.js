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


};


module.exports = mongo;


























