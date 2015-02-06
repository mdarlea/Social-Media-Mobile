(function () {
    'use strict';

    angular.module('app').factory('$pagedDataService', ['$http', '$q', 'ngAuthSettings', function ($http, $q, ngAuthSettings) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var service = {
            baseUrl: "",

            data: {
                fixedPage: false,

                items: [],
                totalRecords: 0,
                selected: [],
                totalPages: 0,

                filterOptions: {
                    filterText: '',
                    externalFilter: 'searchText',
                    useExternalFilter: true
                },
                sortOptions: {
                    fields: [],
                    directions: ["asc"]
                },

                pagingOptions: {
                    pageSizes: [5, 10, 20, 50, 100],
                    pageSize: 5,
                    currentPage: 0
                }
            },

            find: function (queryOptions) {
                if (!this.data.fixedPage) {
                    this.data.pagingOptions.currentPage++;
                };

                var query = (queryOptions) ? queryOptions : {};

                var options = {
                    queryOptions: $.extend(true, {}, query,
                        {
                            sortByField: (this.data.sortOptions.fields.length > 0)
                                ? this.data.sortOptions.fields[0]
                                : null,
                            sortDescending: (this.data.sortOptions.directions.length > 0)
                                ? (this.data.sortOptions.directions[0] === "desc")
                                : false,
                            searchText: this.data.filterOptions.filterText
                        }),
                    page: this.data.pagingOptions.currentPage,
                    pageSize: this.data.pagingOptions.pageSize
                };

                var deferred = $q.defer();

                var that = this;
                $http.post(serviceBase + this.baseUrl, options)
                    .success(function (data) {
                        if (that.data.fixedPage) {
                            that.data.items = data.Content;
                        }
                        else {
                            for (var i = 0; i < data.Content.length; i++) {
                                that.data.items.push(data.Content[i]);
                            }
                        }

                        that.data.totalRecords = data.TotalRecords;

                        deferred.resolve(data);
                    }).error(function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        }

        return service;
    }]);
})();