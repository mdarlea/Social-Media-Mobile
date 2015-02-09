(function () {
    'use strict';

    angular.module('app').controller('HomeController', ['$scope', '$utilities', 'authService', function ($scope, $utilities, authService) {
        ons.ready(function () {
            
        });

        $scope.title = "Home";
        $scope.auth = authService.authentication;


    }]);
})();