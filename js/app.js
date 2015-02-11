(function() {
    'use strict';

    var app = angular.module('app', ['onsen', 'bgSlider']);
  
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);
})();