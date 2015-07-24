(function() {
    'use strict';

    angular.module('app').controller('StreamedTweetsController', ['$scope', 'StreamedTweetsService',
        function ($scope, StreamedTweetsService) {

        var queryOptions = {};

        $scope.title = "Timeline";

        $scope.loadingMessage = "Loading ...";

        var streamedTweetsService = new StreamedTweetsService();
            
        var isEmpty = function (newVal, oldVal) {
            $scope.empty = (newVal.length < 1);
        }

        $scope.data = streamedTweetsService.data;

        $scope.$watchCollection('data.items', isEmpty, true);
        
        var getTweets = function () {
            streamedTweetsService
                    .find(queryOptions)
                    .then(
                        function (response) {

                        }, function (err) {
                            $scope.message = err;
                        }).finally(function (response) {
        
                        });
        }

        var search = function () {
            streamedTweetsService
                    .search(queryOptions)
                    .then(
                        function (response) {

                        },
                        function (err) {
                            $scope.message = err;
                        }).finally(
                            function (response) {

                            },
                            function (notify) {

                            });
        }

        $scope.$watch('data.filterOptions.filterText', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (!$scope.data.loading) {
                    search();
                }
            }
        }, true);

        getTweets();

        $scope.loadMore = function () {
            $scope.swipeup();
        };

        $scope.swipeup = function() {
            //loads next tweets
            if (!$scope.data.loading) {
                getTweets();
            } else {
                $scope.loadingMessage = "Loading more tweets ...";
            }
        }
      
    }]);
})();