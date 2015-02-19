﻿(function () {
    'use strict';

    angular.module('app').controller('LoginController', ['$scope', 'ngAuthSettings', '$utilities', 'authService', '$onsenService',
        function ($scope, ngAuthSettings, $utilities, authService, $onsenService) {
            $scope.slides = ['beach', 'green', 'mountain', 'nature3', 'nature1', 'nature2'];

            $scope.message = "";
            
            $scope.authorize = function (provider) {
                if (!provider) {
                    alert("Please specify a provider");
                    return;
                };

                //$onsenService.debugAuth(true);
                //$onsenService.buildMainNavigation();
                //return;

                var externalProviderUrl = ngAuthSettings.apiServiceBaseUri;
                if (provider === "Twitter") {
                    var callbackUrl = ngAuthSettings.mobileUrl + provider;
                    var redirect = provider + "OAuth/AuthenticateExternal?callbackUrl=" +encodeURIComponent(callbackUrl);

                    externalProviderUrl += redirect;
                
                } else {
                    var redirectUri = ngAuthSettings.apiServiceBaseUri + 'facebookcomplete.html';

                    externalProviderUrl += "api/Account/ExternalLogin?provider=" + provider
                                                                                 + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                                 + "&redirect_uri=" + redirectUri;
                }

                var ref = window.open(externalProviderUrl, "_system");
            };

            var authorize = function(provider, oauthToken, oauthVerifier) {
                    $scope.message = "Authorizing " +provider + " ...";
                    $scope.isAuth = true;

                        var externalData = {
                            provider : provider,
                            externalAccessToken: oauthToken,
                            oauthVerifier: oauthVerifier
                        };

                        authService.obtainAccessToken(externalData, "ObtainLocalAccessTokenWithVerifier")
                            .then(function (response) {
                                if (!authService.authentication.isAuth) {
                                    $scope.message = "Not authorized";
                                    $onsenService.logOut();
                                    //$location.path('/registerexternal');
                                } else {
                                    $onsenService.buildMainNavigation();
                                }

                            }, function (err) {
                                $scope.message = err.error_description;
                            }).finally(function (response) {
                                $scope.isAuth = authService.authentication.isAuth;
                            });
            }

            $scope.externalAuthorization = function (url) {
                ons.ready(function () {
                    $scope.$apply(function () {
                        var provider = $utilities.getProviderName(ngAuthSettings.mobileUrl, url);
                        var fragment = $utilities.getFragment(url);

                        authorize(provider, fragment.oauth_token, fragment.oauth_verifier);
                    });
                });
           
        };

    }]);
})();