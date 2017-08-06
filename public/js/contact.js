/**
 * Created by Dylan on 8/6/2017.
 */
var app = angular.module("contactApp", []);
app.controller('contactController', function ($scope, contactService) {

    $scope.userInfo = {'sender': null, 'content': null, 'name': null};

    $scope.sendEmail = function (form) {
        if (!form.$valid) {
            $scope.errorMessage = "You must complete the form";
            return;
        }

        contactService.sendEmail($scope.userInfo).then(function success(res) {
                console.log(res);
                console.log("email sent");
            }, function error(res) {
                console.log(res);
                console.log("problem sending email");
            }
        )
    }

}).service('contactService', function ($http) {
    this.sendEmail = function (userInfo) {
        var config = {
            method: 'POST',
            url: '/contact',
            data: {contact: userInfo}
        };
        return $http(config);
    }
});