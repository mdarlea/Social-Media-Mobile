(function() {
    'use strict';

    var app = angular.module('app', ['onsen', 'swaksoft.mobile']);
  
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);
})();