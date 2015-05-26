var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relationSchema = new Schema({
    uid: String,
    pid: String,
    ename: String
});


var mailSchema = new Schema({
    from: String,
    to: String,
    uid: String,
    mail: {
        html: String,
        text: String,
        attachments: Schema.Types.Mixed,
        language: String
    }
});


module.exports = {
    relation: relationSchema,
    mail: mailSchema
};