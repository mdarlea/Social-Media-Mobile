(function () {
    'use strict';

    angular.module('app').controller('testController', ['$scope', function ($scope) {
        ons.ready(function () {
            
            //$scope.ons.screen.presentPage("test.html");
        });

        $scope.message = "Test";

    }]);
})();