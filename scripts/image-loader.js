function ImageLoader() {
    this.loading = true;
    this.backgroundImages = [];
    this.idx = 0;
}

ImageLoader.prototype = {
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