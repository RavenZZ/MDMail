var config = require('./configuration');
var controller = require('./controller');
var express = require('express');
var RedisStore = require('connect-redis')(express);

var redis = require('redis');
var cookie = require('express/node_modules/cookie');
var redisConfig = config.redis;
var redisClient = redis.createClient(redisConfig.port, redisConfig.host);
var redisClient2 =  redis.createClient(redisConfig.port, redisConfig.host);
var sessionPrefix = 'ravenHeHe';

var store = new RedisStore({
    host: redisConfig.host,
    port: redisConfig.port,
    client: redisClient,
    prefix: sessionPrefix,
    maxAge: 14400000
});
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    path: '/socket'
});
var Connection = require('./lib/connection');
var connection = new Connection(io);

app.configure(function () {
    app.locals.pretty = true;
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.set("port", config.server.port);
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.session({
        secret: "ravenHaha",
        store: store
    }));
});

io.on('connection', connection.OnConnection);


app.get('/', controller.CheckAuth, controller.Index);
app.get('/index', controller.CheckAuth, controller.Index);
app.get('/login', controller.Login);
app.get('/authorize_callback', controller.AuthCallback);


io.use(function (socket, next) {
    var handshakeData = socket.request;
    if (handshakeData.headers.cookie) {
        var cookies = cookie.parse(handshakeData.headers.cookie);
        var connectId = cookies['connect.sid'].substring(2);
        var indexOfDot = connectId.lastIndexOf('.');
        connectId = connectId.substring(0, indexOfDot);
        console.log('connect.sdi', connectId);
        var fn = store.get(connectId, function (err, result) {
            var user = result;
            socket.UserID = result.user.id;
            socket.ProjectID = result.project.id;
            next();
        });
    }
});

redisClient2.subscribe('newmail');

redisClient2.on('message', function (channel, data) {
    var message = null;
    try {
        message = JSON.parse(data);
    } catch (e) {
        message = null;
    }
    if (channel == 'newmail') {
        console.dir(data);
        io.to(message.uid).emit('new mail', message);
    }
});


server.listen(app.get('port'));
console.log('server is running at port ' + app.get('port'));











