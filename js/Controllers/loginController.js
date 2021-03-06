﻿(function () {
    'use strict';

    angular.module('app').controller('LoginController', ['$scope', 'swAppSettings', '$utilities', 'authService', '$onsenService',
        function ($scope, swAppSettings, $utilities, authService, $onsenService) {
            $scope.images = ['nature1', 'nature3', 'beach', 'green', 'mountain'];
           
            $scope.message = "";
            
            $scope.authorize = function (provider) {
                if (!provider) {
                    alert("Please specify a provider");
                    return;
                };

                //$onsenService.debugAuth(true);
                //$onsenService.buildMainNavigation();
                //return;

                var externalProviderUrl = swAppSettings.apiServiceBaseUri;
                if (provider === "Twitter") {
                    var callbackUrl = swAppSettings.mobileUrl + provider;
                    var redirect = provider + "OAuth/AuthenticateExternal?callbackUrl=" +encodeURIComponent(callbackUrl);

                    externalProviderUrl += redirect;
                
                } else {
                    var redirectUri = swAppSettings.apiServiceBaseUri + 'facebookcomplete.html';

                    externalProviderUrl += "api/Account/ExternalLogin?provider=" + provider
                                                                                 + "&response_type=token&client_id=" + swAppSettings.clientId
                                                                                 + "&redirect_uri=" + redirectUri;
                }

                var ref = window.open(externalProviderUrl, "_system");
            };

            var authorize = function (provider, oauthConfig) {
                    $scope.message = "Authorizing " +provider + " ...";
                    $scope.isAuth = true;

                        var externalData = {
                            externalAccessToken: oauthConfig.oauthToken,
                            oauthVerifier: oauthConfig.oauthVerifier
                        };

                        authService.obtainAccessToken(provider,externalData)
                            .then(function (response) {
                                if (!authService.authentication.isAuth) {
                                    $scope.message = "Not authorized";
                                    $onsenService.logOut();
                                    //$location.path('/registerexternal');
                                } else {
                                    $onsenService.buildMainNavigation();
                                }

                            }, function (err) {
                                $scope.message = err.Message;
                            }).finally(function (response) {
                                $scope.isAuth = authService.authentication.isAuth;
                            });
            }

            $scope.externalAuthorization = function (url) {
                var provider = $utilities.getProviderName(swAppSettings.mobileUrl, url);
                var fragment = $utilities.getFragment(url);

                var oauthConfig = {
                    oauthToken: fragment.oauth_token,
                    oauthVerifier: fragment.oauth_verifier
                }
                authorize(provider, oauthConfig);
            };
    }]);
})();