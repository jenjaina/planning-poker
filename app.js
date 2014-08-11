// app.js
     
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var port = process.env.PORT;
     
app.use(express.static(__dirname + '/site')); // + '/public'));

io.sockets.on('connection', function(socket) {
    socket.on('createCard', function (data) {
        socket.broadcast.emit('onCardCreated', data);
    });
    
    socket.on('deleteCards', function () {
        socket.broadcast.emit('onCardsDeleted');
    });

    socket.on('onToggle', function (val) {
        socket.broadcast.emit('onToggle', val);
    });

    socket.on('onTaskChanged', function (val) {
        socket.broadcast.emit('onTaskChanged', val);
    });

    socket.on('setLeader', function () {
        socket.broadcast.emit('onLeaderSet');
    });

    socket.on('resetLeader', function () {
        socket.broadcast.emit('onLeaderReset');
    })
});
     
// A.3
server.listen(port);