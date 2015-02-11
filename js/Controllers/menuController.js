(function () {
    'use strict';

    angular.module('app').controller('MenuController', ['$scope', 'authService', function ($scope, authService) {
        ons.ready(function () {
           
        });

        $scope.auth = authService.authentication;

        var getPages = function() {
            $scope.pages = ($scope.auth.isAuth) ?
                [{
                      name: "streamedTweets.html",
                      label: "Timeline",
                      icon: "ion-grid",
                      active: true
                  }] : [];   
        }

        getPages();

        $scope.watch("auth.isAuth", getPages);

        $scope.navigateToPage = function(page) {
            $scope.index.menu.setMainPage(page + '.html', { closeMenu: true });
        }
    }]);
})();