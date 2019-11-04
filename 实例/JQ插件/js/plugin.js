(function ($) {
    var PluginName = (function () {
        function PluginName(element, options) {
            this.element = element;
            this.options = $.extend(true, $.fn.PluginName.defaults, options || {});
            this.init();
        }
        PluginName.prototype = {
            init: function () {
                var self = this;
                self.titleCls = self.options.titleCls;
                self.infoCls = self.options.infoCls;
                self.active = self.options.active;
                self.index = 0;
                self.event = self.options.event;
                self._initEvent();
            },
            _initEvent: function () {
                var self = this;
                $(self.element).on(self.event, self.titleCls, function () {
                    self.index = $(this).index();
                    $(this).siblings(self.titleCls).removeClass(self.active);
                    $(this).addClass(self.active);
                    $(self.infoCls).siblings(self.infoCls).removeClass(self.active);
                    $(self.infoCls).eq(self.index).addClass(self.active);
                });
            }
        };
        return PluginName;
    })();
    $.fn.PluginName = function (options) {
        return this.each(function () {
            var self = $(this),
                instance = self.data('PluginName');
            if(!instance) {
                instance = new PluginName(self, options);
                self.data('PluginName', instance);
            }
            if($.type(instance) === 'string') return instance[options]();
        })
    };
    $.fn.PluginName.defaults = {
        titleCls: '.title-btn',
        infoCls: '.info',
        active: 'active',
        event: 'click'
    }
})(jQuery);






































/*
(function ($) {
    var PluginName = (function () {
        function PluginName(element, options) {
            this.element = element;
            this.options = $.extend(true, $.fn.PluginName.defaults, options || {});
            this.init();
        }

        PluginName.prototype = {
            init: function () {
                var self = this;
                self.abc = self.options.abc;
                console.log(self.abc);
            }
        };
        return PluginName;
    })();

    $.fn.PluginName = function (options) {
        return this.each(function () {
            var self = $(this),
                instance = self.data('PluginName');
            if (!instance) {
                instance = new PluginName(self, options);
                self.data('PluginName', instance);
            }
            if($.type(options) === 'string') return instance[options]();
        })
    };
    $.fn.PluginName.defaults = {
        abc: 'abc'
    };
})(jQuery);*/
