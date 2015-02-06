(function() {
    'use strict';

    angular.module('app').controller('streamedTweetsController', function ($scope, $streamedTweetsService) {
        var queryOptions = {
            userProfileId: 21
        };

        $scope.data = $streamedTweetsService.data;

        $streamedTweetsService.find(queryOptions);

        $scope.loadMore = function () {
            //loads next tweets
            $streamedTweetsService.find(queryOptions);
        };
    });
})();