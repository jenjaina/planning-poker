// JavaScript source code
// function () {

var cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, "?", "coffee cup"];

var app = angular.module("PokerApp", ["socketService"]);

app.controller("MainCtrl", function ($scope, socket) {
    $scope.cardchoices = [];
    $scope.cardoptions = cards;
    $scope.params = {
        currenttask: "",
        togglestart: true,
        cardavg: 0.0,
        leaderchosen: false,
        leader: false
    };

    // Incoming
    socket.on('onCardCreated', function (data) {
        $scope.cardchoices.push(data);
    });

    socket.on('onCardsDeleted', function () {
        $scope.cardchoices = [];
        $scope.params.cardavg = 0.0;
        $scope.showMessage = false;
    });

    socket.on('onToggle', function (val) {
        $scope.params.togglestart = val;

        if (!val) {
            $scope.params.cardavg = $scope.calcAvg();
        }
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
    $scope.createCard = function (data) {
        $scope.cardchoices.push(data);
        $scope.showMessage = true;
        socket.emit('createCard', data);
    };

    $scope.deleteCards = function () {
        $scope.cardchoices = [];
        $scope.params.cardavg = 0.0;
        $scope.showMessage = false;
        socket.emit('deleteCards');
    };

    $scope.toggle = function (val) {
        $scope.params.togglestart = val;

        if (!val) {
            $scope.params.cardavg = $scope.calcAvg();
        }

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

    $scope.calcAvg = function (data) {
        count = 0;
        total = 0;
        angular.forEach($scope.cardchoices, function(choice) {
            if (angular.isNumber(choice.card)) {
                count += 1;
                total += choice.card;
            }
        })

        return (total / count);
    };
});

// })();
