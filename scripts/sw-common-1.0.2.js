/*
 * sw-common
 * AngularJS common utility functions and token-based authentication service

 * Created By: Michelle Darlea <mdarlea@gmail.com> (https://github.com/mdarlea)
 * https://github.com/mdarlea/angular-common

 * Version: 1.0.2 - 2015-07-20
 * License: ISC
 */
angular.module('sw.common', ['swCommon','swAuth']);
(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swCommon
 
    * @description This module contains AngularJS common components
    * <h2> Providers </h2>
    * - {@link swCommon.swAppSettingsProvider swAppSettings} 
    * <h2> Services </h2> 
    * - {@link swCommon.PagedDataService PagedDataService}
    */
    var swCommon = angular.module('swCommon', []);
    
    /**
    * @ngdoc service
    * @name swCommon.PagedDataService
    * @requires $http
    * @requires $q
    * @requires swCommon.swAppSettings
    * @description Service that queries paged data.  
    * It can be used with ngGrid, any grind that supports paging or with an infinit-scrolling list
    * 
    * @constructor
    * @param {string} baseUrl base URL for calling the API
    * @param {Object} options Data paging options
    * @param {boolean} [options.fixedPage=false] True for paged grids, False for infinite scrolling lists   
    * @param {Object} options.filterOptions Options for filtering data <table><tr>
         * <td>filterText</td><td><a href="" class="label type-hint type-hint-string">string</a></td>       
         * <td>Text to filter data</td></tr></table>    
    * @param {Object} [options.sortOptions={ fields: new Array(), directions: new Array("asc") }] Options for sorting data <table>
         * <tr>
         * <td>fields</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         * <td>Sort data by the given fields</td></tr>  
         * <tr>
         * <td>directions</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
         * <td>'asc' for sorting arcending, 'desc' for sorting descending. Default is ['asc']</td></tr></table>
    * @param {Object} [options.pagingOptions = { pageSizes: new Array(5, 10, 20, 50, 100), pageSize: 10 }] Options for paging <table>
        * <tr>
        * <td>pageSizes</td><td><a href="" class="label type-hint type-hint-array">Array</a></td>
        * <td>A list of possible page sizes. This option aplies only to paged grids. Default is [5, 10, 20, 50, 100].</td></tr>
        * <tr>
        * <td>pageSize</td><td><a href="" class="label type-hint type-hint-number">number</a></td> 
        * <td>Specifies the number of items on a single page. Default is 10.</td></tr> 
        * <tr>
        * <td>currentPage</td><td><a href="" class="label type-hint type-hint-number">number</a></td> 
        * <td>The current page. This option aplies only to paged grids</td></tr></table> 
     * @example
     * <pre>
        (function () {
            'use strict';

            //A service that inherits from the PagedDataService
            angular.module('app').factory('StreamedTweetsService', ['PagedDataService', 
                function (PagedDataService) {
                    var StreamedTweetsService = function() {
                        PagedDataService.apply(this, ['api/StreamedTweets', {                            
                                pagingOptions: {
                                    pageSize: 5
                                }
                        }]);
                    };

                    StreamedTweetsService.prototype = new PagedDataService();

                    return StreamedTweetsService;
                }]);
        })();     
    * </pre> 
    */
    angular.module('swCommon').factory('PagedDataService', ['$http', '$q', 'swAppSettings', function ($http, $q, swAppSettings) {
        var serviceBase = swAppSettings.apiServiceBaseUri;
 
        var PagedDataService = function (baseUrl, options) {
            this.baseUrl = baseUrl;
                
            this.fixedPage = (options && options.fixedPage) ? options.fixedPage : false;
                
            var data = {
                filterOptions: (options && options.filterOptions) ? options.filterOptions : {},
                sortOptions: (options && options.sortOptions) ? options.sortOptions : {},
                pagingOptions: (options && options.pagingOptions) ? options.pagingOptions : {}
            };

            this.data = $.extend(true, {},
            {
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
                }, data);
            };
            
        PagedDataService.prototype = (function () {
            function getOptions(queryOptions) {
                var query = (queryOptions) ? queryOptions : {};
                var page = (this.fixedPage)
                            ? this.data.pagingOptions.currentPage
                            : null;
                var minIdentity = null;
                if (!this.fixedPage) {
                    var max = this.data.items.length - 1;
                    if (max > -1) {
                        minIdentity = this.data.items[max].Id;
                    }
                }
                    
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
                    minIdentity: minIdentity,
                    pageSize: this.data.pagingOptions.pageSize
                };
            };
                
            function find(queryOptions, deferred, isSearch) {
                var options = this._(getOptions)(queryOptions);

                this.data.loading = true;
                    
                var that = this;
                $http.post(serviceBase + this.baseUrl, options)
                    .success(function (data) {
                    if (isSearch) {
                        deferred.notify(options);
                            
                        var continueSearch = (that.data.filterOptions.filterText !== options.queryOptions.searchText);
                            
                        if (continueSearch) {
                            that._(find)(queryOptions, deferred, true);
                            return;
                        }
                    }
                        
                    if (that.fixedPage) {
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
            };
                
            return {
                constructor: PagedDataService,
                    
                /**
                * @ngdoc method
                * @name swCommon.PagedDataService#init
                * @methodOf swCommon.PagedDataService
                * @description Initializes the data in the paged list. Clears the list of items
                */
                init: function () {
                    this.data.items = [];
                    this.data.totalRecords = 0;
                    this.data.totalPages = 0;
                    this.data.pagingOptions.currentPage = 0;
                    this.data.loading = false;
                },
                    
                /**
                * @ngdoc method
                * @name swCommon.PagedDataService#find
                * @methodOf swCommon.PagedDataService
                * @description Calls API to return the data for the next page
                * @param {Object} queryOptions Options for quering data from the server
                * @returns {Object} the promise to return the data 
                */
                find: function (queryOptions) {
                    if (this.data.loading) {
                        var defer = $q.defer();
                        defer.reject();
                        return defer.promise;
                    }
                        
                    var deferred = $q.defer();
                        
                    this._(find)(queryOptions, deferred, false);
                        
                    return deferred.promise;
                },
                    
                /**
                * @ngdoc method 
                * @name swCommon.PagedDataService#search
                * @methodOf swCommon.PagedDataService
                * @description Calls API to search data based on the information provided in the filterOptions
                * @param {Object} queryOptions Options for quering data from the server
                * @returns {Object} the promise to return the filtered data 
                */                    
                search: function (queryOptions) {
                    var deferred = $q.defer();
                        
                    if (this.data.loading) {
                        deferred.reject();
                        return deferred.promise;
                    }
                        
                    this.data.pagingOptions.currentPage = 0;
                        
                    this._(find)(queryOptions, deferred, true);
                        
                    return deferred.promise;
                },
                    
                // define private methods dedicated one
                _: function (callback) {
                        
                    // instance referer
                    var self = this;
                        
                    // callback that will be used
                    return function () {
                        return callback.apply(self, arguments);
                    };
                }
            }
        })();
            
        return PagedDataService;
    }]);
})();
(function () {
    'use strict';

    /**
    * @ngdoc service
    * @name swCommon.swAppSettingsProvider  
    * @description {@link swCommon.swAppSettings swAppSettings} provider
    * @example    
    *   <pre>
        (function () {
            'use strict';

            angular.module('app').config(['swAppSettingsProvider', 
                function (swAppSettingsProvider) {
                    swAppSettingsProvider.setSettings({
                        apiServiceBaseUri: "http://www.swaksoft.com/",
                        clientId: "SocialMediaApp"
                    });
            }]);
        })();      
    *  </pre>  
    */ 

    /**
    * @ngdoc service
    * @name swCommon.swAppSettings    
    * @description {@link swCommon.swAppSettingsProvider Provider} <br/>
    *   Provides application configuration for different environments such as: Dev, QA, Production
    */
    angular.module('swCommon').provider('swAppSettings', function () {
        var settings = {};
        
       /**
       * @ngdoc method
       * @name swCommon.swAppSettings#setSettings
       * @methodOf swCommon.swAppSettings
       * @description Sets the configuration properties
       * @param {Object} value Configuration property values
       */
        this.setSettings = function (value) {
            settings = value;
        };
        
        this.$get = [
            function () {
                var options = $.extend(true, {
                    /**
                    * @ngdoc property
                    * @name swCommon.swAppSettings#indexPage
                    * @propertyOf swCommon.swAppSettings
                    * @returns {string} Path to the application's home (index) page. <br/><i>(Default: '/home')</i>
                    */
                    indexPage: '/home',
                    
                    /**
                    * @ngdoc property
                    * @name swCommon.swAppSettings#apiServiceBaseUri
                    * @propertyOf swCommon.swAppSettings
                    * @returns {string} Application URL. Example: 'http://www.swaksoft.com/'. <br/><i>(Default: 'http://')</i>
                    */
                    apiServiceBaseUri: 'http://',
                    
                    /**
                    * @ngdoc property
                    * @name swCommon.swAppSettings#clientId
                    * @propertyOf swCommon.swAppSettings
                    * @returns {string} The application name. <br/><i>(Default: 'swCommon')</i>
                    */
                    clientId: 'swCommon'
                }, settings);
                
                return options;
            }
        ];
    });
})();


(function () {
    'use strict';
    
    /**
    * @ngdoc object
    * @name swCommon.$utilities    
    * @description Utility functions (helpers)
    */
    angular.module('swCommon').value("$utilities", {
        /**
        * @ngdoc method
        * @name swCommon.$utilities#parseQueryString
        * @methodOf swCommon.$utilities 
        * @param {string} queryString The query string
        * @description Parses the key/value pairs from a query string into an object
        * @returns {Object} the parsed query string
        */  
        parseQueryString: function (queryString) {
            var data = {}, pair, separatorIndex, escapedKey, escapedValue, key, value;
            if (!queryString) {
                return data;
            }
            
            var pairs = queryString.split("&");
            
            for (var i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                separatorIndex = pair.indexOf("=");
                
                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substr(0, separatorIndex);
                    escapedValue = pair.substr(separatorIndex + 1);
                }
                
                key = decodeURIComponent(escapedKey);
                value = decodeURIComponent(escapedValue);
                
                data[key] = value;
            }
            
            return data;
        },
        
        /**
        * @ngdoc method
        * @name swCommon.$utilities#getFragment
        * @methodOf swCommon.$utilities
        * @param {string} url The URL
        * @description Parses the query string from an URL into an object. 
        *  Calls the {@link swCommon.$utilities#parseQueryString parseQueryString} method to perform the parsing
        * @returns {Object} the parsed query string
        */  
        getFragment: function (url) {
            var pos = url.indexOf("?");
            if (pos > 0) {
                return this.parseQueryString(url.substr(pos + 1));
            } else {
                return {};
            }
        }
    });
})();
(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swAuth
 
    * @description This module contains token based authentication services
    * - {@link swAuth.$authenticationTokenFactory $authenticationTokenFactory} 
    * - {@link swAuth.$authService $authService} 
    */
    var swAuth = angular.module('swAuth', ['swCommon']);

    /**
    * @ngdoc service
    * @name swAuth.AuthenticationToken
    * @description Class responsible for the state and behavior of an authentication token
    * @constructor
    * @param {Object} token The authentication token object
    * @param {datetime} token..expires Token expiration date time
    * @param {datetime} token..issued Date time when the token was issued by the server
    * @param {string} token.access_token The authentication token encrypted string
    * @param {string} token.expires_in Token expiration time span
    * @param {string} token.externalUserName The external user name, the same as user name
    * @param {boolean} token.hasRegistered True if the user was registered, False otherwise              
    * @param {string} token.token_type The value is always "bearer" for token based security                
    * @param {string} token.userName The user name         
    * @param {string} token.refreshToken The refresh token when refresh tokens should be used
    * @param {boolean} token.useRefreshTokens True if refresh tokens should be used, False otherwise
     * @example
     * <pre>
     *  var value = localStorageService.get(key);
     *  var token = new AuthenticationToken(value);
     * </pre>     
    */    
    angular.module('swAuth').factory('AuthenticationToken', [function () {
            
            var AuthenticationToken = function (token) {
                /**
                * @ngdoc property
                * @name swAuth.AuthenticationToken#token 
                * @propertyOf swAuth.AuthenticationToken
                * @returns {Object} The authentication token object
                 */
                this.token = token;
            };
            
            AuthenticationToken.prototype = {
                /**
                * @ngdoc method
                * @name swAuth.AuthenticationToken#isExpired
                * @methodOf swAuth.AuthenticationToken
                * @description Check if the authentication token is expired   
                * @returns {boolean} True if the authetnication token i expired, False otherwise
                */
                isExpired: function () {
                    //ToDo: to be implemented
                    return false;
                }
            };
            
            return AuthenticationToken;
        }]);
})();
(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swAuth.$authService
    * @requires $http
    * @requires $q
    * @requires swAuth.$authenticationTokenFactory
    * @requires swCommon.swAppSettings
    * @description Authentication service    
    */
    angular.module('swAuth').factory('$authService', ['$http', '$q', '$authenticationTokenFactory', 'swAppSettings',
    function ($http, $q, $authenticationTokenFactory, swAppSettings) {
            
            var serviceBase = swAppSettings.apiServiceBaseUri;
            
            var service = {
                /**
                * @ngdoc property
                * @name swAuth.$authService#authentication
                * @propertyOf swAuth.$authService
                * @returns {object} Current user login information <table>
                   <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Details</th>
                   </tr>
                   <tr>
                       <td>isAuth</td>
                       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                       <td>True if current user is authenticated, False otherwise</td>
                   </tr> 
                   <tr>
                       <td>isAuthorizing</td>
                       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                       <td>True if the authorization process is currently taking place, False otherwise</td>
                   </tr> 
                   <tr>
                       <td>userName</td>
                       <td><a href="" class="label type-hint type-hint-string">String</a></td>
                       <td>The authenticated user name</td>
                   </tr> 
                   <tr>
                       <td>useRefreshTokens</td>
                       <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                       <td>True is refresh authorization tokens should be used. False otherwise</td>
                   </tr>                                                                
                */
                authentication: {
                    isAuth: false,
                    isAuthorizing: false,
                    userName: "",
                    useRefreshTokens: false
                },
                
                externalAuthData: {
                    provider: "",
                    userName: "",
                    externalAccessToken: "",
                    externalAccessVerifier: null
                },
                
                saveRegistration: function (registration) {
                    
                    service.logOut();
                    
                    return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                        return response;
                    });
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#obtainAccessToken
                * @methodOf swAuth.$authService
                * @description Calls the authorization service to authenticate the current user and issue the authentication token
                * @param {string} [provider='undefined'] External provider name. Example: Twitter, Facebook etc.
                * @param {Object} [externalData='undefined'] Oauth information, applicable only if provider is not null or undefined
                * @param {string} [externalData.externalAccessToken='undefined'] OAuth token
                * @param {string} [externalData.oauthVerifier='undefined'] OAuth verifier
                * @returns {Object} the promise to return the authorization token from the server. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response
                */
                obtainAccessToken: function (provider, externalData) {
                    
                    var deferred = $q.defer();
                    
                    var actionName = "ObtainLocalAccessToken";
                    var url = serviceBase + "api/" + (provider || "Account") + "/" + actionName;
                    
                    service.authentication.isAuthorizing = true;
                    
                    var data = $.extend(true, {}, externalData, { clientId: swAppSettings.clientId });
                    
                    $http.get(url, {
                        params: data
                    }).success(function (response) {
                        var hasRegistered = response.hasRegistered;
                        
                        service.externalAuthData.provider = data.provider;
                        
                        if (hasRegistered) {
                            service._authorize(response);
                        }
                        else {
                            service.authentication.isAuth = false;
                            service.authentication.userName = "";
                            service.authentication.useRefreshTokens = false;
                            
                            service.externalAuthData.userName = response.externalUserName;
                            service.externalAuthData.externalAccessToken = response.externalAccessToken;
                            service.externalAuthData.externalAccessVerifier = response.externalAccessVerifier;
                        }
                        
                        service.authentication.isAuthorizing = false;
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        
                        service.authentication.isAuthorizing = false;
                        deferred.reject(err.Message);
                    });
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#login
                * @methodOf swAuth.$authService
                * @param {Object} loginData Login information
                * @description Logs in the current user
                * @returns {Object} the promise to return the authorization token for the logged in user from the server. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response                 
                */   
                login: function (loginData) {
                    
                    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
                    
                    if (loginData.useRefreshTokens) {
                        data = data + "&client_id=" + swAppSettings.clientId;
                    }
                    
                    var deferred = $q.defer();
                    
                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        
                        if (loginData.useRefreshTokens) {
                            $authenticationTokenFactory.createFrom(response, true);
                        }
                        else {
                            $authenticationTokenFactory.createFrom(response, false);
                        }
                        
                        service.authentication.isAuth = true;
                        service.authentication.userName = loginData.userName;
                        service.authentication.useRefreshTokens = loginData.useRefreshTokens;
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        deferred.reject(err);
                    });
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#logOut
                * @methodOf swAuth.$authService
                * @description Logs the current user out and removes the authentication token from the local storage
                */                
                logOut: function () {
                    
                    $authenticationTokenFactory.removeToken();
                    
                    service.authentication.isAuth = false;
                    service.authentication.userName = "";
                    service.authentication.useRefreshTokens = false;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#fillAuthData
                * @methodOf swAuth.$authService
                * @description Reads the authentication token from the local storage and updates the state of the {@link swAuth.$authService#authentication authentication} property with this information
                * @example
                * <pre>
                    app.run(['$authService', function ($authService) {
                        $authService.fillAuthData();
                    }]);                 
                * </pre>
                */    
                fillAuthData: function () {
                    
                    var authData = $authenticationTokenFactory.getToken();
                    if (authData) {
                        var token = authData.token;
                        service.authentication.isAuth = true;
                        service.authentication.userName = token.userName;
                        service.authentication.useRefreshTokens = token.useRefreshTokens;
                    }
                },
                
                refreshToken: function () {
                    var deferred = $q.defer();
                    
                    var authData = $authenticationTokenFactory.getToken();
                    
                    if (authData) {
                        
                        if (authData.useRefreshTokens) {
                            var token = authData.token;
                            var data = "grant_type=refresh_token&refresh_token=" + token.refreshToken + "&client_id=" + swAppSettings.clientId;
                            
                            $authenticationTokenFactory.removeToken();
                            
                            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                                
                                $authenticationTokenFactory.createFrom(response, true);
                                
                                deferred.resolve(response);

                            }).error(function (err, status) {
                                service.logOut();
                                deferred.reject(err);
                            });
                        }
                    }
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#register
                * @methodOf swAuth.$authService
                * @description Registers a new user with the current application and authenticates the user
                * @param {object} registerData User model                
                * @param {object} registerData.userName User name
                * @param {object} registerData.password User password
                * @param {object} registerData.confirmPassword User password for verification
                * @returns {Object} the promise to return the authorization token from the server for the registered user. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response
                */                
                register: function (registerData) {
                    
                    var deferred = $q.defer();
                    
                    var data = angular.extend({}, registerData, { clientId: swAppSettings.clientId });
                    
                    $http.post(serviceBase + 'api/account/register', data).success(function (response) {
                        
                        service._authorize(response);
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        deferred.reject(err);
                    });
                    
                    return deferred.promise;
                },                
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#registerExternal
                * @methodOf swAuth.$authService
                * @description Registers the user with a third party provider such as Twitter or Facebook and authenticates this user
                * @param {object} registerExternalData The infomration about the user that is registered. It should contain properties with information about the external provider, the user name and any additional information that should be saved in the registered user profile
                * @param {object} registerExternalData.provider The external provider name
                * @param {object} registerExternalData.userName The user name                
                * @returns {Object} the promise to return the authorization token from the server for the registered user. 
                 * See the {@link swAuth.$authService#authorize authorize} method for a description of the JSON object returned by the service response
                */                
                registerExternal: function (registerExternalData) {
                    
                    var deferred = $q.defer();
                    
                    var data = angular.extend({}, registerExternalData, { clientId: swAppSettings.clientId });
                    
                    $http.post(serviceBase + 'api/account/registerexternal', data).success(function (response) {
                        
                        service._authorize(response);
                        
                        deferred.resolve(response);

                    }).error(function (err, status) {
                        service.logOut();
                        deferred.reject(err);
                    });
                    
                    return deferred.promise;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authService#authorize
                * @methodOf swAuth.$authService
                * @description Authenticates the current user and stores the authentication token in the local storage                
                * @param {Object} response The authentication token JObject issued by the server
                * @param {datetime} response..expires Token expiration date time
                * @param {datetime} response..issued Date time when the token was issued by the server
                * @param {string} response.access_token The authentication token encrypted string
                * @param {string} response.expires_in Token expiration time span
                * @param {string} response.externalUserName The external user name, the same as user name
                * @param {boolean} response.hasRegistered True if the user was registered, False otherwise              
                * @param {string} response.token_type The value is always "bearer" for token based security                
                * @param {string} response.userName The user name
                */
                authorize: function (response) {
                    service.externalAuthData.provider = response.provider;
                    this._authorize(response);
                },
                
                _authorize: function (response) {
                    service.externalAuthData.userName = response.externalUserName;
                    service.externalAuthData.externalAccessToken = null;
                    service.externalAuthData.externalAccessVerifier = null;
                    
                    $authenticationTokenFactory.createFrom(response);
                    
                    service.authentication.isAuth = true;
                    service.authentication.userName = response.userName;
                    service.authentication.useRefreshTokens = false;
                }
            };
            
            return service;

        }]);
})();
(function () {
    'use strict';
    
    /**
    * @ngdoc service
    * @name swAuth.$authenticationTokenFactory
    * @requires swCommon.swAppSettings
    * @requires localStorageService
    * @requires swAuth.AuthenticationToken     
    * @description Service that performs the following functions:
    *   - reads an authentication token from a response and stores it in the local storage
    *   - gets the current authentication token from the local storage
    *   - removes the current authetnication token from the local storage   
    */              
    angular.module('swAuth').factory('$authenticationTokenFactory',
        ['swAppSettings', 'localStorageService', 'AuthenticationToken', function (swAppSettings, localStorageService, AuthenticationToken) {
            
            var key = "authorizationData_" + swAppSettings.clientId;
            
            var factory = {
                /**
                * @ngdoc method
                * @name swAuth.$authenticationTokenFactory#createFrom
                * @methodOf swAuth.$authenticationTokenFactory
                * @description Creates the authentication token object from the HTTP response and stores it in the local storage
                * @param {Object} response The authentication token JObject issued by the server
                * @param {datetime} response..expires Token expiration date time
                * @param {datetime} response..issued Date time when the token was issued by the server
                * @param {string} response.access_token The authentication token encrypted string
                * @param {string} response.expires_in Token expiration time span
                * @param {string} response.externalUserName The external user name, the same as user name
                * @param {boolean} response.hasRegistered True if the user was registered, False otherwise              
                * @param {string} response.token_type The value is always "bearer" for token based security                
                * @param {string} response.userName The user name
                * @param {boolean} useRefreshTokens True if refresh tokens should be used, False otherwise
                * @returns {Object} the authentication token. The returned objected is an extension of the <b>response</b> parameter with the following additional properties: <table>
                   <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Details</th>
                   </tr>                 
                 * <tr>
                 *  <td>refreshToken</td>
                 *  <td><a href="" class="label type-hint type-hint-string">String</a></td>
                 *  <td>The refresh token when refresh tokens should be used</td>
                 * </tr>
                 * <tr>
                 *  <td>useRefreshTokens</td>
                 *  <td><a href="" class="label type-hint type-hint-boolean">Boolean</a></td>
                 *  <td>True if refresh tokens should be used, False otherwise</td>
                 * </tr>                 
                 * </table>
                */
                createFrom: function (response, useRefreshTokens) {
                    var token = $.extend(true, {}, response, {
                        refreshToken: (useRefreshTokens) ? response.refresh_token : "",
                        useRefreshTokens: (useRefreshTokens) ? useRefreshTokens : false
                    });
                    localStorageService.set(key, token);
                    return token;
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authenticationTokenFactory#removeToken
                * @methodOf swAuth.$authenticationTokenFactory
                * @description Removes the authentication token from the local storage                
                */
                removeToken: function () {
                    localStorageService.remove(key);
                },
                
                /**
                * @ngdoc method
                * @name swAuth.$authenticationTokenFactory#getToken
                * @methodOf swAuth.$authenticationTokenFactory
                * @description Gets the authentication token from the local storage
                * @returns {AuthenticationToken} {@link swAuth.AuthenticationToken AuthenticationToken} the authentication token object stored in the local storage
                */
                getToken: function () {
                    var token = localStorageService.get(key);
                    return (token) ? new AuthenticationToken(token) : null;
                }
            };
            
            return factory;
        }]);
})();