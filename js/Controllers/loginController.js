(function () {
    'use strict';

    angular.module('app').controller('loginController', ['$scope', 'ngAuthSettings', function ($scope, ngAuthSettings) {
        $scope.authExternalProvider = function (provider) {
            if (!provider) {
                alert("Please specify a provider");
                return;
            };

            //var button = $scope.login[provider.toLowerCase()];
            
            var externalProviderUrl = ngAuthSettings.apiServiceBaseUri;
            if (provider === "Twitter") {
                //var callbackUrl = "http://www.swaksoft.com/oauth/callbackmobile";
                var callbackUrl = "appuri://callback";

                externalProviderUrl += "OAuth/AuthenticateExternal?callbackUrl=" + encodeURIComponent(callbackUrl);
                //externalProviderUrl += "OAuth";
                
            } else {
                var redirectUri = ngAuthSettings.apiServiceBaseUri + 'facebookcomplete.html';

                externalProviderUrl += "api/Account/ExternalLogin?provider=" + provider
                                                                             + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                             + "&redirect_uri=" + redirectUri;
                window.$windowScope = $scope;
            }          

            var ref = window.open(externalProviderUrl, "_system");
        };

       
        //$scope.authExternalProvider("Twitter");


    }]);
})();