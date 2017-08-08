/**
 * Created by Dylan on 8/7/2017.
 */
var app = angular.module('userApp', []);

app.controller('userController', ['$scope', 'userService', '$window', function ($scope, userService, $window) {
    $scope.username;
    $scope.password;
    $scope.errorMessage;
    $scope.loggedIn = false;
    $scope.login = function (form) {
        $scope.errorMessage = null;
        if (!form.$valid) {
            $scope.error = "Must fill out both fields.";
            return;
        }

        userService.login($scope.username, $scope.password).then(function (response) {
            if (response.data.success === "true") {
                $window.location.href = "/admin";
            }
            else {
                console.log(response)
                $scope.errorMessage = response.data.message;
            }
        });

    };

    $scope.logout = function () {
        userService.logout().then(function success(response){
            $window.location.href = '/auth/login'
        }, function error(response){
            console.log("something went horribly wrong");
        });
    }


}]).service('userService', function ($http) {

    this.login = function (username, password) {
        var config = {
            method: 'POST',
            url: '/auth/login',
            data: {username: username, password: password}
        };

        return $http(config);
    };

    this.logout = function () {
       return $http.post('/auth/logout');
    }


});