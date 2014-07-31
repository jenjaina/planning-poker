// JavaScript source code
// function () {

var cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, "?", "coffee cup"];

var app = angular.module("PokerApp", []);

app.controller("MainCtrl", function ($scope, socket) {
    $scope.cardchoices = [];
    $scope.cardoptions = cards;
    $scope.params = {
        currenttask: "",
        togglestart: true,
        leaderchosen: false,
        leader: false
    };

    // Incoming
    socket.on('onCardCreated', function (data) { // B.3
        $scope.cardchoices.push(data);
    });

    socket.on('onCardsDeleted', function () {
        $scope.cardchoices = [];
        $scope.showMessage = false;
    });

    socket.on('onToggle', function (val) {
        $scope.params.togglestart = val;
    });

    socket.on('onTaskChanged', function (val) {
        $scope.params.currenttask = val;
    });

    socket.on('onLeaderSet', function () {
        $scope.params.leaderchosen = true;
    });

    socket.on('onLeaderReset', function () {
        $scope.params.leaderchosen = false;
    })
    
    // Outgoing
    $scope.createCard = function(data) { // B.4
        $scope.cardchoices.push(data);
        $scope.showMessage = true;
        socket.emit('createCard', data);
    };

    $scope.deleteCards = function () {
        $scope.cardchoices = [];
        $scope.showMessage = false;
        socket.emit('deleteCards');
    };

    $scope.toggle = function (val) {
        $scope.params.togglestart = val;
        socket.emit('onToggle', val);
    };

    $scope.changeTask = function (data) {
        $scope.params.currenttask = data;
        socket.emit('onTaskChanged', data);
    };

    $scope.setLeader = function () {
        $scope.params.leader = true;
        $scope.params.leaderchosen = true;
        socket.emit('setLeader');
    };

    $scope.resetLeader = function () {
        $scope.params.leader = false;
        $scope.params.leaderchosen = false;
        socket.emit('resetLeader');
    };
});

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});



// })();
