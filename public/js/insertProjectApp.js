/**
 * Created by Dylan on 8/6/2017.
 */

var app = angular.module('insertProjectApp', []);

app.controller('insertController', function ($scope, projectService) {

    $scope.projectName;
    $scope.shortDesc;
    $scope.longDesc;
    $scope.githubLink;
    $scope.imageFileName;

    $scope.postToServer = function (form) {

        if (!form.$valid) {
            $scope.errorMessage = "Empty Fields, Dylan";
            return;
        }

        var config = {
            method: 'POST',
            url: '/admin/addProject',
            data: {
                project: {
                    name: $scope.projectName,
                    desc: $scope.shortDesc,
                    longDesc: $scope.longDesc,
                    link: $scope.githubLink,
                    fileName: ($scope.imageFileName != null ? $scope.imageFileName : null)
                }
            }
        };

        projectService.addToDB(config).then(function success(req, res) {
            console.log(res);
        }, function error(req, res) {
            console.log(res);
        })


    };


}).service('projectService',function($http){
    this.addToDB = function(config){
        return $http(config);
    }
});