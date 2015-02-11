(function() {
    'use strict';

    angular.module('app').controller('StreamedTweetsController', ['$scope', '$streamedTweetsService', function ($scope, $streamedTweetsService) {

        var queryOptions = {
            userProfileId: 21
        };

        $scope.title = "Timeline";

        $scope.loadingMessage = "Loading ...";

        $streamedTweetsService.init();

        $scope.data = $streamedTweetsService.data;

        $streamedTweetsService.find(queryOptions);
        

        $scope.loadMore = function () {
            //loads next tweets
            if (!$scope.data.loading) {
                $streamedTweetsService
                    .find(queryOptions)
                    .then(
                        function(response) {

                        }, function(err) {
                            $scope.message = err.error_description;
                        }).finally(function(response) {

                    });;
            } else {
                $scope.loadingMessage = "Loading more tweets ...";
            }
        };
    }]);
})();