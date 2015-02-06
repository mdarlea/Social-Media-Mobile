(function() {
    'use strict';

    var serviceBaseTest = 'http://localhost:52499/';
    var serviceBase = 'http://www.swaksoft.com/';

    angular.module('app').constant('ngAuthSettings', {
        apiServiceBaseUri: serviceBase,
        clientId: 'SocialMediaApp',
        indexPage: '/home'
    });

    //angular.module('app').constant('ngAuthSettings', {
    //    apiServiceBaseUri: serviceBaseTest,
    //    clientId: 'SocialMediaTestApp',
    //    indexPage: '/home'
    //});
})();