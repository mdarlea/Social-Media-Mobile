(function () {
    'use strict';

    angular.module('app').controller('SettingsController', ['$scope', '$onsenService', function ($scope, $onsenService) {
        ons.ready(function () {

        });

        $scope.title = "Settings";

        $scope.logOut = function() {
            $onsenService.logOut();
        }

    }]);
})();