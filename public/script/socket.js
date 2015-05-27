var Socket = function (onConnect) {
    var _this = this;
    var socket = io.connect(location.origin, {
        path: '/socket'
    });
    this.GenerateNew = function (callback) {
        socket.emit('generate new', {}, function (data) {
            var name = data.name;
            callback(name);
        });
    };
    this.ValidateName = function (name, callback) {
        socket.emit('validate name', {
            name: name
        }, function (data) {
            callback(data);
        });
    };

    this.BindRelation = function (ename, callback) {
        socket.emit('add relation', {
            ename: ename
        }, function (data) {
            callback(data);
        });
    };

    this.GetMails = function (pageIndex,callback) {
        socket.emit('mails',{i:pageIndex}, function (mails) {
            callback(mails);
        });
    };
    socket.on('connect', function () {
        onConnect();
    });
};
