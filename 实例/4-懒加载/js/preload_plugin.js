(function ($) {
    var PreLoad = (function () {
        function PreLoad(element, options) {
            this.element = element;
            this.options = $.extend(true, $.fn.PreLoad.defaults, options || {});
            this.init();
        }

        PreLoad.prototype = {
            init: function () {
                var self = this;
                self.imgs = ($.type(self.options.imgs) === 'string') ? [self.options.imgs] : self.options.imgs;
                self.count = 0;
                self.len = self.imgs.length;
                self.order = self.options.order;
                self.each = self.options.each;
                self.all = self.options.all;
                self._order();
            },
            _order: function () {
                var self = this;
                if (self.order === 'unoredered') {
                    $.each(self.imgs, function (i, src) {
                        if ($.type(src) !== 'string') return;
                        var imgObj = new Image();
                        $(imgObj).on('load error', function () {
                            self.each && self.each(self.count);
                            if ((self.count + 1) >= self.len) {
                                self.all && self.all();
                            }
                            self.count++;
                        });
                        imgObj.src = src;
                    });
                } else if (self.order === 'ordered') {
                    load();
                    function load() {
                        var imgObj = new Image();
                        $(imgObj).on('load error', function () {
                            if ((self.count + 1) >= self.len) {
                                self.all && self.all();
                            } else {
                                load();
                            }
                            self.count++;
                        });
                        imgObj.src = self.imgs[self.count];
                    }
                }
            }
        };
        return PreLoad;
    })();
    $.fn.PreLoad = function (options) {
        return this.each(function () {
            var self = $(this),
                instance = self.data('PreLoad');
            if (!instance) {
                instance = new PreLoad(self, options);
                self.data('PreLoad', instance);
            }
            if ($.type(options) === 'string') return instance[options]();
        })
    };
    $.fn.PreLoad.defaults = {
        imgs: null,
        order: 'unoredered',         //unoredered:无序     ordered:有序
        each: '',
        all: ''
    };
})(jQuery);
