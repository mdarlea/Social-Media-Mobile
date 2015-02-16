(function() {
    'use strict';

    angular.module('app').controller('StreamedTweetsController', ['$scope', '$streamedTweetsService', function ($scope, $streamedTweetsService) {

        var queryOptions = {
            userProfileId: 21
        };

        $scope.title = "Timeline";

        $scope.loadingMessage = "Loading ...";

        $streamedTweetsService.init();

        var isEmpty = function () {
            $scope.empty = ($scope.data.items.length < 1);
        }

        $scope.data = $streamedTweetsService.data;

        $scope.$watch('data.items', isEmpty, true);

        var getTweets = function () {
            $streamedTweetsService
                    .find(queryOptions)
                    .then(
                        function (response) {

                        }, function (err) {
                            $scope.message = err.error_description;
                        }).finally(function (response) {

                        });
        }

        var search = function () {
            if ($scope.data.loading) return;

            $scope.data.totalRecords = 0;
            $scope.data.totalPages = 0;
            $scope.data.pagingOptions.currentPage = 0;

            getTweets();
        }

        $scope.$watch('data.filterOptions.filterText', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                search();
            }
        }, true);

        getTweets();

        $scope.loadMore = function () {
            //loads next tweets
            if (!$scope.data.loading) {
                getTweets();
            } else {
                $scope.loadingMessage = "Loading more tweets ...";
            }
        };
    }]);
})();