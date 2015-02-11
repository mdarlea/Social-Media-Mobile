(function () {
    'use strict';

    angular.module('app').controller('LoginController', ['$scope', 'ngAuthSettings', '$utilities', 'authService', '$onsenService',
        function ($scope, ngAuthSettings, $utilities, authService, $onsenService) {
            $scope.slides = ['beach', 'green', 'mountain', 'nature1', 'nature2'];

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

            //$scope.isAuth = authService.authentication.isAuth;

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
                    });
                });
           
        };

    }]);
})();