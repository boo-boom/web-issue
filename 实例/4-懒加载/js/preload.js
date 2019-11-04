(function ($) {
    /**
     * 预加载
     * @param [imgs]
     * @param {options}
     * @constructor
     */
    function Preload(imgs, options) {
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        this.opts = $.extend({}, Preload.DEFAULT, options);
        if(this.opts.order === 'ordered'){
            this._ordered();
        }else{
            this._unoredered();
        }
    }

    Preload.DEFAULT = {
        order: 'unoredered',//无序加载
        each: null,         //每一张加载后执行
        all: null           //全部加载后执行
    };

    Preload.prototype._unoredered = function () {       //无序加载
        var imgs = this.imgs,
            opts = this.opts,
            len = imgs.length,
            count = 0;
        $.each(imgs, function (i, src) {
            if(typeof src !== 'string') return;
            var imgObj = new Image();
            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);
                if ((count + 1) >= len) {
                    opts.all && opts.all();
                }
                count++;
            });
            imgObj.src = src;
        });
    };

    Preload.prototype._ordered = function () {          //有序加载
        var imgs = this.imgs,
            opts = this.opts,
            len = imgs.length,
            count = 0;
        load();
        function load() {
            var imgObj = new Image();
            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);
                if (count >= len) {
                    opts.all && opts.all();
                    console.log('全部加载完成...');
                } else {
                    load();
                }
                count++;
            });
            imgObj.src = imgs[count];
        }
    };

    $.extend({
        preload: function (imgs, opts) {
            new Preload(imgs, opts);
        }
    });
})(jQuery);