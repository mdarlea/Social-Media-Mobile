(function () {
    'use strict';

    //angular.module('app').controller('IndexController', ['$scope', 'authService', '$onsenService', function ($scope, authService, $onsenService) {
    angular.module('app').controller('IndexController', ['$scope', 'authService', '$onsenService', function ($scope, authService, $onsenService) {
        //authService.debugAuth(false);
        
        ons.ready(function () {
            //authService.logOut();
            $onsenService.buildMainNavigation(authService.authentication.isAuth);
        });
    }]);
})();