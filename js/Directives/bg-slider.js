(function () {
    'use strict';

    var module = angular.module('bgSlider', []);

    module.directive('bgSlider', function () {
        var data = {
            loading: true,
            backgroundImages: [],
            idx: 0,
            getFirst: function () {
                return (this.idx > 0) ? this.backgroundImages[0] : "";
            },
            getCurrent: function () {
                return this.backgroundImages[this.idx];
            },
            getNext: function () {
                if (this.idx === (this.backgroundImages.length - 1)) {
                    this.idx = 0;
                } else {
                    this.idx++;
                };
                return this.getCurrent();
            },
            load: function (images, imgFilter, callback) {
                this.loading = true;
                this.idx = 0;
                if (imgFilter) {
                    this.backgroundImages = [];
                    for (var i = 0; i < images.length; i++) {
                        this.loadImage(images[i], images.length, imgFilter, callback);
                    }
                } else {
                    this.backgroundImages = images;
                    callback();
                    this.loading = false;
                }
            },
            loadImage: function (name, counter, imgFilter, callback) {
                var imgPath = imgFilter.replace("{0}", name);

                var image = new Image();
                image.src = imgPath;
                var that = this;
                image.onload = function (img) {
                    console.log("Image loaded " + img);
                    var css = that.backgroundImages;
                    css.push(name);
                    if (css.length === counter) {
                        callback();
                        that.loading = false;
                    }
                };

                // handle failure
                image.onerror = function (err) {
                    console.log("Could not load image " + imgPath);
                };
            }
        };

        return {
            link: function (scope, elm, attr) {
                data.loading = true;
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
                    data.load(images, filter, function () {
                        var first = data.getFirst();
                        for (var i = 0; i < data.backgroundImages; i++) {
                            var img = data.backgroundImages[i];
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
                    if (!data.loading) {
                        elm.removeClass(data.getCurrent()).addClass(data.getNext());
                    }
                }, 3000);

                scope.$on('$destroy', function (e) {
                    clearInterval(slider);
                });
            }
        };
    });
})();