(function () {
    'use strict';

    angular.module('swaksoft.common').directive('bgSlider', function () {
        return {
            link: function (scope, elm, attr) {
                var loader = new ImageLoader();
                loader.loading = true;
                var css = "slider__background";

                if (!elm.hasClass(css)) {
                    elm.addClass(css);
                }

                var loadedFilter = null;
                var loadedImages = null;

                var loadImages = function (images, filter) {
                    if (filter === loadedFilter && images === loadedImages && images.length === loadedImages.length) {
                        return;
                    }

                    //preload images
                    loader.load(images, filter, function () {
                        var first = loader.getFirst();
                        for (var i = 0; i < loader.backgroundImages; i++) {
                            var img = loader.backgroundImages[i];
                            if (img !== first) {
                                elm.removeClass(img);
                            }
                        }

                        if (!elm.hasClass(first)) {
                            elm.addClass(first);
                        }
                    });
                    loadedFilter = filter;
                    loadedImages = images;
                };

                scope.$watch(attr.bgSlider, function (newVal, oldVal) {
                    loadImages(newVal, attr.imgFilter);
                }, true);

                attr.$observe('imgFilter', function (val) {
                    var images = scope.$eval(attr.bgSlider);
                    loadImages(images, val);
                });

                var slider = setInterval(function () {
                    if (!loader.loading) {
                        elm.removeClass(loader.getCurrent()).addClass(loader.getNext());
                    }
                }, 3000);

                scope.$on('$destroy', function (e) {
                    if (slider) {
                        clearInterval(slider);
                    }
                });
            }
        };
    });
})();