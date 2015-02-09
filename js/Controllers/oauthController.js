(function () {
    'use strict';

    angular.module('app').controller('OauthController', ['$scope', 'ngAuthSettings', '$utilities', 'authService',
        function ($scope, ngAuthSettings, $utilities, authService) {
            $scope.slides = ['beach', 'green', 'mountain', 'nature1', 'nature2'];

            $scope.message = "";
        
            $scope.isAuth = authService.authentication.isAuth;
            
            $scope.getUserName = function () {
                return authService.authentication.userName;
            };
        
            $scope.authExternal = function (provider) {
                if (!provider) {
                    alert("Please specify a provider");
                    return;
                };

            //var button = $scope.login.button.[provider.toLowerCase()];

            var externalProviderUrl = ngAuthSettings.apiServiceBaseUri;
            if (provider === "Twitter") {
                var callbackUrl = "appuri://callback";
                //var callbackUrl = "http://www.swaksoft.com/oauth/callbackmobile";

                externalProviderUrl += "OAuth/AuthenticateExternal?callbackUrl=" + encodeURIComponent(callbackUrl);
                
            } else {
                var redirectUri = ngAuthSettings.apiServiceBaseUri + 'facebookcomplete.html';

                externalProviderUrl += "api/Account/ExternalLogin?provider=" + provider
                                                                             + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                             + "&redirect_uri=" + redirectUri;
            }

            var ref = window.open(externalProviderUrl, "_system");
        };

            $scope.externalAuthorization = function (url) {
                ons.ready(function () {
                    $scope.$apply(function () {
                        $scope.isAuth = true;
                        $scope.message = "Authorizing Twitter ...";

                        var fragment = $utilities.getFragment(url);
                        
                        var externalData = {
                            provider: "Twitter",
                            oauthToken: fragment.oauth_token,
                            oauthVerifier: fragment.oauth_verifier
                        };

                        authService.obtainAccessToken(externalData, "ObtainLocalAccessTokenWithVerifier")
                            .then(function (response) {
                                if (!authService.authentication.isAuth) {
                                    authService.logOut();
                                    $scope.message = "Not authorized";
                                    //$location.path('/registerexternal');
                                } else {
                                    index.menu.setMenuPage("menu.html");
                                    index.menu.setMainPage("home.html");
                                }

                            }, function (err) {
                                $scope.message = err.error_description;
                            }).finally(function (response) {
                                $scope.isAuth = authService.authentication.isAuth;
                            });
                    });
                });
           
           
        };

    }]);
})();