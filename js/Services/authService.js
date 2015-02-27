(function () {
'use strict';
angular.module('app').factory('authService', ['$http', '$q', '$authenticationTokenFactory', 'ngAuthSettings',
    function ($http, $q, $authenticationTokenFactory, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var service = {

        authentication: {
            isAuth: false,
            isAuthorizing:false,
            userName: "",
            useRefreshTokens: false
        },

        externalAuthData: {
            provider: "",
            userName: "",
            externalAccessToken: "",
            externalAccessVerifier: null
        },
       
        saveRegistration: function (registration) {

            service.logOut();

            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });
        },

        obtainAccessToken: function (provider,externalData) {

            var deferred = $q.defer();

            var actionName = "ObtainLocalAccessToken";
            var url = serviceBase + "api/" + provider + "/" + actionName;

            service.authentication.isAuthorizing = true;

            var data = $.extend(true, {}, externalData, { clientId: ngAuthSettings.clientId });

            $http.get(url, {
                params: data
            }).success(function (response) {
                var hasRegistered = response.hasRegistered;

                service.externalAuthData.provider = data.provider;

                if (hasRegistered) {
                    service._authorize(response);
                }
                else {
                    service.authentication.isAuth = false;
                    service.authentication.userName = "";
                    service.authentication.useRefreshTokens = false;

                    service.externalAuthData.userName = response.externalUserName;
                    service.externalAuthData.externalAccessToken = response.externalAccessToken;
                    service.externalAuthData.externalAccessVerifier = response.externalAccessVerifier;
                }

                service.authentication.isAuthorizing = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                service.logOut();

                service.authentication.isAuthorizing = false;
                deferred.reject(err);
            });

            return deferred.promise;
        },

        login: function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                if (loginData.useRefreshTokens) {
                    $authenticationTokenFactory.createFrom(response, true);
                }
                else {
                    $authenticationTokenFactory.createFrom(response, false);
                }

                service.authentication.isAuth = true;
                service.authentication.userName = loginData.userName;
                service.authentication.useRefreshTokens = loginData.useRefreshTokens;

                deferred.resolve(response);

            }).error(function (err, status) {
                service.logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        },

        logOut: function () {

            $authenticationTokenFactory.removeToken();

            service.authentication.isAuth = false;
            service.authentication.userName = "";
            service.authentication.useRefreshTokens = false;
        },

        fillAuthData: function () {

            var authData = $authenticationTokenFactory.getToken();
            if (authData) {
                var token = authData.token;
                service.authentication.isAuth = true;
                service.authentication.userName = token.userName;
                service.authentication.useRefreshTokens = token.useRefreshTokens;
            }
        },

        refreshToken: function () {
            var deferred = $q.defer();

            var authData = $authenticationTokenFactory.getToken();

            if (authData) {

                if (authData.useRefreshTokens) {
                    var token = authData.token;
                    var data = "grant_type=refresh_token&refresh_token=" + token.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                    $authenticationTokenFactory.removeToken();

                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                        $authenticationTokenFactory.createFrom(response, true);

                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        },

        registerExternal: function (registerExternalData) {

            var deferred = $q.defer();

            var data = $.extend(true, {}, registerExternalData, { clientId: ngAuthSettings.clientId });

            $http.post(serviceBase + 'api/account/registerexternal', data)
                .success(function (response) {

                    service._authorize(response);

                    deferred.resolve(response);

                }).error(function (err, status) {
                    service.logOut();
                    deferred.reject(err);
                });

            return deferred.promise;
        },

        _authorize: function(response) {
            service.externalAuthData.userName = response.externalUserName;
            service.externalAuthData.externalAccessToken = null;
            service.externalAuthData.externalAccessVerifier = null;

            $authenticationTokenFactory.createFrom(response);

            service.authentication.isAuth = true;
            service.authentication.userName = response.userName;
            service.authentication.useRefreshTokens = false;
        },

        authorize: function (response) {
            service.externalAuthData.provider = response.provider;
            this._authorize(response);
        }
    };

    return service;

    }]);
})();