(function () {
    'use strict';
    angular.module('swaksoft.mobile').factory('$authenticationTokenFactory', ['localStorageService', function (localStorageService) {

        var key = "authorizationData";

        function AuthenticationToken(token) {
            this.token = token;
        };

        AuthenticationToken.prototype = {
            isExpired: function () {
                return false;
            }
        };

        var factory = {

            createFrom: function (response, useRefreshTokens) {
                var token = $.extend(true, {}, response, {
                    refreshToken: (useRefreshTokens) ? response.refresh_token : "",
                    useRefreshTokens: (useRefreshTokens) ? useRefreshTokens : false
                });
                localStorageService.set(key, token);
                return token;
            },

            removeToken: function () {
                localStorageService.remove(key);
            },

            getToken: function () {
                var token = localStorageService.get(key);
                return (token) ? new AuthenticationToken(token) : null;
            }
        };

        return factory;
    }]);
})();