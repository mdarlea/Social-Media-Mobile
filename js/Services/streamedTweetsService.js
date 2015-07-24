(function () {
    'use strict';

    angular.module('app').factory('StreamedTweetsService',
        ['PagedDataService', function (PagedDataService) {
            var StreamedTweetsService = function () {
                PagedDataService.apply(this, ['api/StreamedTweets', {
                    fixedPage: false,
                    sortOptions: {
                        fields: ["UserName"]
                    },
                    pagingOptions: {
                        pageSize: 10
                    }
                }]);
            };

            StreamedTweetsService.prototype = new PagedDataService();

            return StreamedTweetsService;
        }]);
})();