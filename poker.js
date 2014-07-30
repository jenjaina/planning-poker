// JavaScript source code
// function () {

var app = angular.module("PokerApp", []);

app.controller("MainCtrl", function ($scope) {
    $scope.cardchoices = model;
    $scope.cardoptions = cards;
    $scope.name = "Guest";
    $scope.data = {
        togglestart: true,
        tasknum: 0
    };

    $scope.addUser = function (newUser) {
        if (angular.isDefined(newUser) && angular.isDefined(newUser.name)) {
            $scope.name = newUser.name;
        }
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

var model = [{
    task: "Writing a program",
    choices: [{ user: "Guest", card: "8" },
        { user: "Jenni", card: "100" }]
}];
// })();
