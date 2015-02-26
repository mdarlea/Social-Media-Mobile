(function() {
    'use strict';

    angular.module('swaksoft.mobile').directive('whenScrolled', function () {
        return {
            link: function(scope, elm, attr) {
                var raw = elm[0];

                elm.bind('scroll', function() {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attr.whenScrolled);
                    }
                });
            }
        }
    });
})();