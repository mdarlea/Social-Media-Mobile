(function () {
    'use strict';

    angular.module('app').controller('IndexController', ['$scope', '$utilities', 'authService', function ($scope, $utilities, authService) {
        //authService.authorize({
        //    provider: "Twitter",
        //    externalUserName: "christianity017",
        //    access_token: "QQXaziIXta0-yOPHxcHWnW57SOGFcTzzrH63MUb6qYgt2NjYLDDCS5Y5FvPxW0Er9ioHRKHaQoPox8KwdyuxkHKS7yQa6w567wVbITO327b8R-jPFEhHzThA2J8BAEm5Xi6jT3DS25oLr_QiGRLkUONbN4qAfl_7RhaC2qBRejy4aZ-SfiA2tL7yL1ycImBfp36HUcI_qEe8n0-vkUtvTcmGc7OHlIO7P5WNsddK8zxDc0a05TmsVXhE59PK4B_0y-Uk1JT2-rigvhQMjhNJFw",
        //    userName: "michelle.darlea@gmail.com"
        //});

        ons.ready(function () {
            if (authService.authentication.isAuth) {
                $scope.index.menu.setMenuPage("menu.html");
                $scope.index.menu.setMainPage("home.html");
            } else {
                $scope.index.menu.setMainPage("oauth.html");
            }
        });
    }]);
})();