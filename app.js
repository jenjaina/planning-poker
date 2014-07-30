// app.js
     
// A.1
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
     
// A.2
app.configure(function() {
    app.use(express.static(__dirname)); // + '/public'));
});

io.sockets.on('connection', function(socket) {
    socket.on('createCard', function(data) {
        socket.broadcast.emit('onCardCreated', data);
    });
     
    socket.on('updateCard', function(data) {
        socket.broadcast.emit('onCardUpdated', data);
    });
     
    socket.on('deleteCard', function(data){
        socket.broadcast.emit('onCardDeleted', data);
    });
});
     
// A.3
server.listen(1337);