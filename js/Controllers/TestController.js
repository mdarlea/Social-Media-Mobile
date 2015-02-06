(function () {
    'use strict';

    angular.module('app').controller('testController', ['$scope', function ($scope) {
        
        $scope.message = "Hello World";
    }]);
})();