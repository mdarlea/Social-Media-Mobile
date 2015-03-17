(function () {
    'use strict';
    angular.module('app').factory('$onsenService', ['authService', function(authService) {

        var service = {
            debugAuth: function () {
                var isAuth = authService.authentication.isAuth;
                if (isAuth) {
                    authService.authorize({
                        provider: "Twitter",
                        externalUserName: "",
                        access_token: "",
                        userName: "abc@gmail.com"
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