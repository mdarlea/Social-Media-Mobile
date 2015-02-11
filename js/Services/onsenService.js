(function () {
    'use strict';
    angular.module('app').factory('$onsenService', [function() {

        var service = {
            buildMainNavigation: function (isAuth) {
                var navigator = (index && index.navigator) ? index.navigator : null;
                if (!navigator) {
                    throw "Invalid onsen navigator";
                }

                var page = (isAuth) ? "mainNav.html" : "oauth.html";

                var options = { animation: 'none' };
                navigator.resetToPage(page, options);
                
                console.log("Page added to main navigator " +page);
            }
        };

        return service;
    }]);
})();