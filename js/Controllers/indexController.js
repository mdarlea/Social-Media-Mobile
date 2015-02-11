(function () {
    'use strict';

    angular.module('app').controller('IndexController', ['$scope', '$onsenService', function ($scope, $onsenService) {
        //authService.debugAuth(false);
        
        ons.ready(function () {
            $onsenService.logOut();
            //$onsenService.buildMainNavigation();
        });
    }]);
})();