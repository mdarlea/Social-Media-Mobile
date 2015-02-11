(function () {
    'use strict';

    var module = angular.module('bgSlider', []);

    module.directive('bgSlider', function () {
        var data = {
            loading: true,
            //imgPathPattern: "/images/{0}.jpg",
            imgPathPattern: null,
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
            load: function (images, callback) {
                this.loading = true;
                this.idx = 0;
                if (this.imgPathPattern) {
                    this.backgroundImages = [];
                    for (var i = 0; i < images.length; i++) {
                        this.loadImage(images[i], images.length, callback);
                    }
                } else {
                    this.backgroundImages = images;
                    callback();
                    this.loading = false;
                }
            },
            loadImage: function (name, counter, callback) {
                var imgPath = this.imgPathPattern.replace("{0}", name);

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
                image.onerror = function () {
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
                
                scope.$watch(attr.bgSlider, function (newVal, oldVal) {
                    //preload images
                    data.load(newVal, function () {
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