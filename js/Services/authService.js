(function () {
'use strict';
angular.module('app').factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

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

        login: function(loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                if (loginData.useRefreshTokens) {
                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                }
                else {
                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
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

            localStorageService.remove('authorizationData');

            service.authentication.isAuth = false;
            service.authentication.userName = "";
            service.authentication.useRefreshTokens = false;
        },

        fillAuthData: function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                service.authentication.isAuth = true;
                service.authentication.userName = authData.userName;
                service.authentication.useRefreshTokens = authData.useRefreshTokens;
            }
        },

        refreshToken: function () {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                    localStorageService.remove('authorizationData');

                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                        localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

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

            $http.post(serviceBase + 'api/account/registerexternal', registerExternalData)
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

            localStorageService.set('authorizationData', {
                token: response.access_token,
                userName: response.userName,
                refreshToken: "",
                useRefreshTokens: false
            });

            service.authentication.isAuth = true;
            service.authentication.userName = response.userName;
            service.authentication.useRefreshTokens = false;
        }
    };

    return service;

    }]);
})();