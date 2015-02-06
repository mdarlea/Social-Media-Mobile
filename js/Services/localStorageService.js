(function () {
    'use strict';
    angular.module('app').factory('localStorageService', ['$window', function ($window) {
        var service = {
            set: function(key, value) {
                if (key) {
                    $window.localStorage.setItem(key, value);
                }
            },

            get: function(key) {
                return (key) ? $window.localStorage.getItem(key) : null;
            }
        };

        return service;
   }]);
})();