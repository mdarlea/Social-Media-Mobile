(function () {
    'use strict';
    angular.module('app').factory('$utilities', [function () {

        var service = {
            parseQueryString: function(queryString) {
                var data = {}, pair, separatorIndex, escapedKey, escapedValue, key, value;
                if (queryString === null) {
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

            getFragment: function(url) {
                var pos = url.indexOf("?");
                if (pos > 0) {
                    return this.parseQueryString(url.substr(pos + 1));
                } else {
                    return {};
                }
            },

            getProviderName: function(root, url) {
                var pos = url.indexOf("?");
                if (pos < 0) {
                    pos = url.length - 1;
                }
                var len = root.length;
                return url.substr(len, pos-len);
            }
        };

        return service;
    }]);
})();