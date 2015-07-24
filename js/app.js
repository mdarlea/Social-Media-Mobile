(function() {
    'use strict';

    var app = angular.module('app', ['onsen', 'sw.common', 'swaksoft.mobile']);
  
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.config(function ($provide) {
        $provide.decorator('$utilities', function ($delegate) {
            angular.extend($delegate, {
                getProviderName: function (root, url) {
                    var pos = url.indexOf("?");
                    if (pos < 0) {
                        pos = url.length - 1;
                    }
                    var len = root.length;
                    return url.substr(len, pos - len);
                }
            });

            return $delegate;
        });
    });

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);
})();