var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relationSchema = new Schema({
    uid: String,
    pid: String,
    ename: String
});


var mailSchema = new Schema({
    from: String,
    fromNickname: String,
    to: String,
    uid: String,
    time: {type: Date, default: Date.now},
    subject: String,
    mail: {
        html: String,
        text: String,
        attachments: [Schema.Types.Mixed]
    }
});


module.exports = {
    relation: relationSchema,
    mail: mailSchema
};