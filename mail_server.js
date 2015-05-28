var config = require('./configuration');
var mailin = require('mailin');
var mongo = require('./lib/mongo');
var db = new mongo();
var async = require('async');
var redis = require('redis');
var redisConfig = config.redis;
var redisClient = redis.createClient(redisConfig.port, redisConfig.host);

/* Start the Mailin server. The available options are:
 *  options = {
 *     port: 25,
 *     webhook: 'http://mydomain.com/mailin/incoming,
 *     disableWebhook: false,
 *     logFile: '/some/local/path',
 *     logLevel: 'warn', // One of silly, info, debug, warn, error
 *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
 *        SMTPBanner: 'Hi from a custom Mailin instance'
 *     }
 *  };
 * Here disable the webhook posting so that you can do what you want with the
 * parsed message. */
mailin.start({
    port: 25,
    disableWebhook: true, // Disable the webhook posting.
    logFile:'/usr/local/mailtest/log.txt',
    logLevel:'warn',
    disableSpamScore:true // ½ûÓÃSpam
});

/* Access simplesmtp server instance. */
mailin.on('authorizeUser', function(connection, username, password, done) {
    //if (username == "johnsmith" && password == "mysecret") {
    //  done(null, true);
    //} else {
    //  done(new Error("Unauthorized!"), false);
    //}
    done(null, true);
});

/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
    /* connection = {
     from: 'sender@somedomain.com',
     to: 'someaddress@yourdomain.com',
     id: 't84h5ugf',
     authentication: { username: null, authenticated: false, status: 'NORMAL' }
     }
     }; */
    //console.log(connection);
});

/* Event emitted after a message was received and parsed. */
mailin.on('message', function (connection, data, content) {
    var toMails = data.to;
    var okMailArray = [];
    toMails.forEach(function (m) {
        if (m && m.address) {
            var add = m.address;
            var mDoamin = add.substring(add.lastIndexOf('@'));
            if (mDoamin == config.mailDomain) {
                okMailArray.push(m);
            }
        }
    });

    var bindedMails = [];

    async.eachSeries(okMailArray, function (m, next) {
        db.getRelationByMail(m.address, function (err, relation) {
            if (!err && relation) {
                var mailItem = {
                    to: m,
                    uid: relation.uid
                };
                bindedMails.push(mailItem);
            }
            next();
        });
    }, function (err) {
        console.log('binded mails');
        console.dir(bindedMails);
        var from = data.from[0];
        var m = {
            from: from.address,
            fromNickname: from.name,
            to: '',
            uid: '',
            subject: data.subject,
            time: new Date(),
            mail: {
                html: data.html,
                text: data.text,
                attachments: data.attachments
            }
        };
        async.eachSeries(bindedMails, function (mObj, next) {
            var to = mObj.to.address;
            var uid = mObj.uid;
            m.to = to;
            m.uid = uid;
            redisClient.publish('newmail', JSON.stringify(m));

            db.addMail(m.from, m.fromNickname, to, uid, m.subject, m.mail, function (addError, result) {
                next();
            });
        }, function (error) {
            console.log('add Success');
        });
    });

    //console.log(data);
    /* Do something useful with the parsed message here.
     * Use parsed message `data` directly or use raw message `content`. */
});
console.log('started');