// JavaScript source code
// function () {

var app = angular.module("PokerApp", []);

app.controller("MainCtrl", function ($scope, socket) {
    $scope.cardchoices = [];
    $scope.cardoptions = cards;
    $scope.data = {
        togglestart: true,
        tasknum: -1
    };

    // Incoming
    socket.on('onCardCreated', function(data) { // B.3
        $scope.cardchoices.push(data);
    });

    // *** Can probably just reset cardchoices to [] *** //
    socket.on('onCardDeleted', function (data) {
        $scope.handleDeletedCard(data.name);
    });
    
    // Outgoing
    $scope.createCard = function() { // B.4
        var card = {
            name: 'Jenni',
            task: 'Write a program',
            card: '13'
        };
        
        $scope.cardchoices.push(card);
        socket.emit('createCard', card);
    };

    // *** Can probably just reset cardchoices to [] *** //
    $scope.deleteCard = function (name) {
        $scope.handleDeletedCard(name);
        socket.emit('deleteNote', { name: name });
    };

    // *** Can probably just reset cardchoices to [] *** //
    $scope.handleDeletedCard = function (name) {
        var oldCards = $scope.cardchoices,
            newCards = [];

        angular.forEach(oldCards, function (card) {
            if (card.name !== name) newCards.push(card);
        });

        $scope.cardchoices = newCards;
    }

    $scope.addTask = function (newTask) {
        if (angular.isDefined(newTask) && angular.isDefined(newTask.projectDescription)) {
            $scope.cardchoices.push({ task: newTask.projectDescription, choices: [] }); 
        } else {
            $scope.cardchoices.push({ task: "", choices: [] });
        }
        $scope.data.tasknum += 1;
    }

    $scope.addCard = function (newUser, newCard) {
        if (angular.isDefined(newUser) && angular.isDefined(newUser.name) &&
            angular.isDefined(newCard) && angular.isDefined(newCard.selectCard)) {
            $scope.cardchoices[$scope.data.tasknum].choices.push({
                user: newUser.name,
                card: newCard.selectCard
            });
        }
    }

});

var cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, "?", "coffee cup"];

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

app.directive('pokerCards', function (socket) {
    var controller = function ($scope) {
        // Incoming
        socket.on('onCardUpdated', function (data) {
            // Update if the same note
            if (data.name == $scope.cardchoices.name) {
                $scope.cardchoices.task = data.task;
                $scope.cardchoices.card = data.card;
            }
        });

        // Outgoing
        $scope.updateCard = function (card) {
            socket.emit('updateCard', card);
        };

        $scope.deleteCard = function (name) {
            $scope.ondelete({
                name: name
            });
        };
    };

    return {
        restrict: 'A',
        controller: controller,
        scope: {
            card: '=',
            ondelete: '&'
        }
    };
});

// })();
