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
        
        var getTweets = function () {
            $streamedTweetsService
                    .find(queryOptions)
                    .then(
                        function (response) {

                        }, function (err) {
                            $scope.message = err;
                        }).finally(function (response) {
        
                        });
        }

        var search = function () {
            $streamedTweetsService
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
            //loads next tweets
            if (!$scope.data.loading) {
                getTweets();
            } else {
                $scope.loadingMessage = "Loading more tweets ...";
            }
        };

        $scope.lazyRepeatDelegate = {
            countItems: function () {
                // Return number of items.
                return 100;
            },

            calculateItemHeight: function (index) {
                // Return the height of an item in pixels.
                return 45;
            },

            configureItemScope: function (index, itemScope) {
                // Initialize scope
            },

            destroyItemScope: function (index, itemScope) {
                // Optional method that is called when an item is unloaded.
                console.log('Destroyed item with index: ' + index);
            }
        };
    }]);
})();