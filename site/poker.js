// JavaScript source code
// function () {

var cards = [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 34, 55, 89, 144, "?", "coffee cup"];

var app = angular.module("PokerApp", ["socketService"]);

app.controller("MainCtrl", function ($scope, socket) {
  var _ = require('underscore');

  $scope.cardchoices = [];
  $scope.cardoptions = cards;
  $scope.currentUsers = [];
  $scope.params = {
    currenttask: "",
    scalechoice: "false",
    togglestart: true,
    cardavg: 0.0,
    leaderchosen: false,
    leader: false,
    showInstructions: false
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

  socket.on('onCardsChanged', function (data) {
    $scope.cardoptions = $scope.parseCards(data);
  });

  socket.on('onLeaderSet', function () {
    $scope.params.leaderchosen = true;
  });

  socket.on('onLeaderReset', function () {
    $scope.params.leaderchosen = false;
  });

  socket.on('onUserAdded', function (data) {
    if (!(_.contains($scope.currentUsers, data))) {
      $scope.currentUsers.push(data);
    }
  });

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

  $scope.changeCards = function (data) {
    $scope.cardoptions = $scope.parseCards(data);
    socket.emit('onCardsChanged', data);
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

  $scope.addUser = function (data) {
    if (!(_.contains($scope.currentUsers, data))) {
      $scope.currentUsers.push(data);
    }
    socket.emit('addUser', data);
  };

  $scope.calcAvg = function (data) {
    count = 0;
    total = 0;
    angular.forEach($scope.cardchoices, function(choice) {
      if (angular.isNumber(choice.card)) {
        count += 1;
        total += choice.card;
      }
    });

    return (total / count);
  };

  $scope.parseCards = function (data) {
    cardarray = [];
    re = /\s*,\s*/;

    if (angular.isDefined(data) && angular.isString(data)) {
      values = angular.lowercase(data).split(re);
      angular.forEach(values, function (val) {
        if (parseInt(val)) {
          cardarray.push(parseInt(val));
        } else {
          cardarray.push(val);
        }
      });
      $scope.scaleMessage = "Scale changed successfully";
      return cardarray;
    } else if (angular.isDefined(data) && data === cards) {
      $scope.scaleMessage = "Using Fibonacci scale";
      return cards;
    } else {
      $scope.scaleMessage = "Invalid entry";
      return cards;
    }
  };
});

app.filter('getLines', function() {
  return function(input) {
    return input.split('\n');
  };
});

// })();
