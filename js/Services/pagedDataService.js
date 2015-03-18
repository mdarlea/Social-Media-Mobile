(function () {
    'use strict';

    angular.module('app').factory('$pagedDataService', ['$http', '$q', 'ngAuthSettings', function ($http, $q, ngAuthSettings) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var pendingSearch = false;

        var service = {
            baseUrl: "",

            data: {
                fixedPage: false,
                loading: false,
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
                    pageSize: 10,
                    currentPage: 0
                }
            },

            init: function () {
                this.data.items = [];
                this.data.totalRecords = 0;
                this.data.totalPages = 0;
                this.data.pagingOptions.currentPage = 0;
                this.data.loading = false;
            },

            _find: function (queryOptions, deferred, isSearch) {
                var options = this._getOptions(queryOptions);

                this.data.loading = true;

                var that = this;
                $http.post(serviceBase + this.baseUrl, options)
                  .success(function (data) {
                      if (isSearch) {
                          deferred.notify(options);

                          var continueSearch = (that.data.filterOptions.filterText !== options.queryOptions.searchText);

                          that._find(queryOptions, deferred, continueSearch);
                          return;
                      }

                      if (that.data.fixedPage) {
                          that.data.items = data.Content;
                      }
                      else {
                          if (that.data.pagingOptions.currentPage < 1) {
                              that.data.items = data.Content;
                          } else {
                              for (var i = 0; i < data.Content.length; i++) {
                                  that.data.items.push(data.Content[i]);
                              }
                          }

                          that.data.pagingOptions.currentPage++;
                      }

                      that.data.totalRecords = data.TotalRecords;

                      that.data.loading = false;

                      deferred.resolve(data);

                  })
                  .error(function (err) {

                      that.data.loading = false;

                      deferred.reject(err.Message);
                  });
            },

            _getOptions: function (queryOptions) {
                var query = (queryOptions) ? queryOptions : {};
                var page = (this.data.fixedPage)
                                ? this.data.pagingOptions.currentPage
                                : this.data.pagingOptions.currentPage + 1;

                return {
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
                    page: page,
                    pageSize: this.data.pagingOptions.pageSize
                };
            },

            find: function (queryOptions) {
                if (this.data.loading) {
                    var defer = $q.defer();
                    defer.reject();
                    return defer.promise;
                }

                var deferred = $q.defer();

                this._find(queryOptions, deferred, false);

                return deferred.promise;
            },

            search: function (queryOptions) {
                var deferred = $q.defer();

                if (this.data.loading) {
                    deferred.reject();
                    return deferred.promise;
                }

                this.data.pagingOptions.currentPage = 0;

                this._find(queryOptions, deferred, true);

                return deferred.promise;
            }
        }

        return service;
    }]);
})();