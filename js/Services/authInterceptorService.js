(function () {
'use strict';
angular.module('app').factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

    var authInterceptorServiceFactory = {
        request: function(config) {
            config.headers = config.headers || {};

            var factory = $injector.get("$authenticationTokenFactory");

            var authData = factory.getToken();
            if (authData && !authData.isExpired()) {
                config.headers.Authorization = 'Bearer ' + authData.token.access_token;
            }

            return config;
        },

        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        },

        responseError: function (rejection) {
            if (rejection.status === 401) {
                //var authService = $injector.get('authService');
                var service = $injector.get('$onsenService');

                var factory = $injector.get("$authenticationTokenFactory");

                var authData = factory.getToken();

                if (authData) {
                    if (authData.token.useRefreshTokens) {
                        $location.path('/refresh');
                        return $q.reject(rejection);
                    }
                }
                service.logOut();
            }
            return $q.reject(rejection);
        }
    };

    return authInterceptorServiceFactory;
}]);
})();