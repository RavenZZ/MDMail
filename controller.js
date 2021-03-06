var colors = require('colors');
var config = require('./configuration');
var mdapi = require('./mdapi');
var ApiLoginUrl = mdapi.ApiLoginUrl;
var async = require('async');
require('date-util');
var mongo = require('./lib/mongo');
var db = new mongo();

/*
 * if there is no session redirect to login
 * */
function CheckAuth(req, res, next) {
    if (!req.session || !req.session.user || !req.session.token) {
        console.warn('There is No Session'.cyan);
        res.writeHead(302, {
            'Location': 'login',
            'content-type': 'text/html'
        });
        res.end();
    } else {
        console.log(('The token is ' + req.session.token).green);
        next();
    }
}

/*
 * check session without redirect
 * */
function CheckAuthWithoutRedirect(req, res, next) {
    if (!req.session || !req.session.user || !req.session.token) {
        res.json({
            msg: 'no session state'
        });
    } else {
        next();
    }
}

function Login(req, res, next) {
    if (!req.session || !req.session.token) {
        console.warn('Login: no session'.cyan);
        res.writeHead(302, {
            'Location': ApiLoginUrl,
            'content-type': 'text/html'
        });
        res.end();
    } else {
        console.log('There is session'.green);
        res.redirect('index');
        res.end();
    }
}

function AuthCallback(req, res, next) {
    var code = req.query.code;
    var state = req.query.stale;
    var token = null;
    async.series([
        function (ok) {
            mdapi.GetToken(code, function (getTokenError, tokenObj) {
                if (getTokenError) {
                    ok({error: getTokenError, text: tokenObj});
                } else {
                    console.log('the token is '.gray, JSON.stringify(tokenObj).gray);
                    token = tokenObj.access_token;
                    req.session.token = token;
                    ok();
                }
            });
        }, function (ok) {
            mdapi.GetCurrentUserInfo(token, function (getUserInfoError, userObj) {
                if (getUserInfoError) {
                    ok({error: getUserInfoError, text: userObj});
                } else {
                    req.session.user = {
                        id: userObj.id,
                        name: userObj.name,
                        avatar: userObj.avatar,
                        avatar100: userObj.avatar100,
                        email: userObj.email
                    };
                    var projectInfo = userObj.project;
                    req.session.project = {
                        id: projectInfo.id,
                        name: projectInfo.name,
                        logo: projectInfo.logo
                    };
                    console.log('the user id is '.gray, userObj.id.gray);
                    res.redirect('index');
                }
            });
        }
    ], function (err) {
        res.json({err: err});
    });
}

function Index(req, res, next) {
    var user = req.session.user;
    var project = req.session.project;
    var relation = {};
    async.series([
        function (done) {
            db.getRelation(user.id, project.id, function (err, result) {
                if (err) {
                    done(result);
                } else {
                    relation = result;
                    done();
                }
            });
        }, function () {
            if (relation == null) {
                res.render('index.jade', {
                    v: '11',
                    title: 'M-Smarter',
                    uid: user.id,
                    uname: user.name,
                    email: user.email,
                    relation: relation ? relation.ename : '',
                    domain: config.mailDomain
                });
            } else {
                res.render('mails.jade', {
                    v: '11',
                    title: 'M-Smarter',
                    uid: user.id,
                    uname: user.name,
                    ename: relation.ename,
                    domain: config.mailDomain
                });
            }

        }
    ], function (err) {
        res.json({
            err: err
        });
    });
    //res.json({
    //    token:req.session.token,
    //    user:req.session.user,
    //    project:req.session.project
    //})
}


exports.Index = Index;
exports.CheckAuth = CheckAuth;
exports.CheckAuthWithoutRedirect = CheckAuthWithoutRedirect;
exports.Login = Login;
exports.AuthCallback = AuthCallback;

