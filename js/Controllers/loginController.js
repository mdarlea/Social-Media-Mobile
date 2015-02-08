(function () {
    'use strict';

    angular.module('app').controller('loginController', ['$scope', 'ngAuthSettings', 'localStorageService', 'authService', 
        function ($scope, ngAuthSettings, localStorageService, authService) {

        $scope.images = ['beach', 'green', 'mountain', 'nature1', 'nature2'];
            
        $scope.isAuthorized = function () {
            return authService.authentication.isAuth;
        };

        $scope.getUserName = function () {
            return authService.authentication.userName;
        };

        $scope.auth = {
            token: "Null"
        };

        $scope.externalAuthorization = function(url) {

            $scope.$apply(function() {
                $scope.auth.token = url;
            });
        };

        $scope.authExternalProvider = function (provider) {
            if (!provider) {
                alert("Please specify a provider");
                return;
            };

            //var button = $scope.login[provider.toLowerCase()];

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
    }]);
})();