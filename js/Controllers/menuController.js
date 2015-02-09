(function () {
    'use strict';

    angular.module('app').controller('MenuController', ['$scope', 'authService', function ($scope, authService) {
        ons.ready(function () {
           
        });

        $scope.pages = [
            {
                name: 'home',
                title: 'Home',
                icon: 'home'
            }, {
                name: 'test',
                title: 'Test',
                icon: 'search'
        }];

        $scope.isAuthorized = authService.authentication.isAuth;
        
        $scope.navigateToPage = function(page) {
            $scope.index.menu.setMainPage(page + '.html', { closeMenu: true });
        }
    }]);
})();