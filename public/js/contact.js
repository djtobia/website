/**
 * Created by Dylan on 8/6/2017.
 */
var app = angular.module("contactApp", []);
app.controller('contactController', function ($scope, contactService) {
    $scope, emailSent = false;
    $scope.errorMessage = null;
    $scope.emailSentMessage = null;
    $scope.userInfo = {'email': null, 'content': null, 'name': null};

    $scope.sendEmail = function (form) {
        if (!form.$valid) {
            $scope.errorMessage = "You must complete the form";
            return;
        }
        var recaptcha = grecaptcha.getResponse();

        if (recaptcha.length != 0) {
            contactService.checkCaptcha(recaptcha).then(function success(res){
                if(res){
                    contactService.sendEmail($scope.userInfo).then(function success(res) {
                            if (res) {
                                $scope.emailSent = true;
                                $scope.emailSentMessage = "Your email has been sent.";
                                $scope.errorMessage = null;
                            }
                        }, function error(res) {
                            console.log(res);
                            console.log('problem sending email');
                            $scope.errorMessage = 'There has been an error sending your email. Please try again later, or manually send an email to dylan@dylantobia.com, with the subject line "dylantobia.com contact"';
                        }
                    );
                }
                else{console.log("CAPTCHA FAILED")}
            }, function error(res){
                console.log("ERROR");
                console.log(res);
            });


        }
        else {
            $scope.errorMessage = "You must check the recaptcha.";
        }
    }

}).service('contactService', function ($http) {

    this.checkCaptcha = function(recaptcha){
      var config = {
          method: 'POST',
          url: '/contact/checkCaptcha',
          data: {captcha: recaptcha}
      }

      return $http(config);

    };
    this.sendEmail = function (userInfo) {
        var config = {
            method: 'POST',
            url: '/contact/sendEmail',
            data: {contact: userInfo}
        };
        return $http(config);
    }
});