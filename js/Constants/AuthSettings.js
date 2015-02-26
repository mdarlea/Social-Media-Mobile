(function() {
    'use strict';
    
    var serviceBase = 'http://www.swaksoft.com/';

    angular.module('app').constant('ngAuthSettings', {
        apiServiceBaseUri: serviceBase,
        clientId: 'SocialMediaMobile',
        indexPage: '/home',
        mobileUrl: 'appuri://'
    });
})();