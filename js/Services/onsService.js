(function () {
    'use strict';
    angular.module('app').factory('$onsenService', ['authService', function(authService) {

        var service = {
            debugAuth: function () {
                var isAuth = authService.authentication.isAuth;
                if (isAuth) {
                    authService.authorize({
                        provider: "Twitter",
                        externalUserName: "christianity017",
                        access_token: "QQXaziIXta0-yOPHxcHWnW57SOGFcTzzrH63MUb6qYgt2NjYLDDCS5Y5FvPxW0Er9ioHRKHaQoPox8KwdyuxkHKS7yQa6w567wVbITO327b8R-jPFEhHzThA2J8BAEm5Xi6jT3DS25oLr_QiGRLkUONbN4qAfl_7RhaC2qBRejy4aZ-SfiA2tL7yL1ycImBfp36HUcI_qEe8n0-vkUtvTcmGc7OHlIO7P5WNsddK8zxDc0a05TmsVXhE59PK4B_0y-Uk1JT2-rigvhQMjhNJFw",
                        userName: "michelle.darlea@gmail.com"
                    });
                } else {
                    authService.logOut();
                }
            },

            buildMainNavigation: function () {
                var isAuth = authService.authentication.isAuth;
                var navigator = (index && index.navigator) ? index.navigator : null;
                if (!navigator) {
                    throw "Invalid onsen navigator";
                }

                var page = (isAuth) ? "mainNav.html" : "login.html";
                
                var options = { animation: 'none' };
                navigator.resetToPage(page, options);
                
                console.log("Page added to main navigator " +page);
            },

            logOut: function () {
                authService.logOut();
                this.buildMainNavigation();
            }
        };

        return service;
    }]);
})();