(function () {
    'use strict';

    angular.module('app').factory('$streamedTweetsService',
        ['$http', '$q', '$pagedDataService', function ($http, $q, $pagedDataService) {
            var service = $.extend(true, {}, $pagedDataService,
                {
                    baseUrl: 'api/StreamedTweet',
                    data: {
                        fixedPage: false,
                        sortOptions: {
                            fields: ["UserName"]
                        },
                        pagingOptions: {
                            pageSize: 10,
                            currentPage: 1
                        }
                    }
                });

            return service;
        }]);
})();