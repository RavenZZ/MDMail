var spawn = require('child_process').spawn,
    server = null;

function startApiServer(){
    console.log('start api server');
    server = spawn('node',['index.js']);

    server.on('close', function (code, signal) {
        server.kill(signal);
        server = startApiServer();
    });

    server.on('error', function (code, signal) {
        server.kill(signal);
        server = startApiServer();
    });


    server.stdout.setEncoding('utf8');
    server.stdout.on('data', function (data) {
        console.log(data);
    });
    server.stderr.setEncoding('utf8');
    server.stderr.on('data', function (data) {
        console.log(data);
    });


    return server;

}

startApiServer();







