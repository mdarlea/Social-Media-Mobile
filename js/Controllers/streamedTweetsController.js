(function() {
    'use strict';

    angular.module('app').controller('StreamedTweetsController', ['$scope', '$streamedTweetsService', function ($scope, $streamedTweetsService) {

        var queryOptions = {};

        $scope.title = "Timeline";

        $scope.loadingMessage = "Loading ...";

        $streamedTweetsService.init();
        
        var isEmpty = function (newVal, oldVal) {
            $scope.empty = (newVal.length < 1);
        }

        $scope.data = $streamedTweetsService.data;

        $scope.$watch('data.items', isEmpty, true);

        var pendingSearch = false;
        var getTweets = function () {
            $streamedTweetsService
                    .find(queryOptions)
                    .then(
                        function (response) {

                        }, function (err) {
                            $scope.message = err;
                        }).finally(function (response) {
                            if (pendingSearch) {
                                search();
                            }
                        });
        }

        var search = function () {
            pendingSearch = $scope.data.loading;
            if (pendingSearch) {
                return;
            }
                
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