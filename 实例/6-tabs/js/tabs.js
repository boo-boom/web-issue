;(function ($) {
    function Tab(obj, opt) {
        this.obj = obj;
        this.opt = $.extend({}, Tab.config, opt);
        this.init();
    }

    Tab.config = {
        'triggerType': 'mouseover',
        'effect': 'default',
        'invoke': 1,
        'auto': false,
        'afterFun': null
    };
    Tab.prototype = {
        init: function () {
            var _this = this;
            this.navItem = $(this.obj).find('.tab-nav > .item');
            this.contentItem = $(this.obj).find('.content-wrap > .content-item');
            if (this.opt.auto) {
                this.timer = null;
                this.loop = 0;
                this.autoPlay();
                $(this.obj).hover(function () {
                    clearInterval(_this.timer);
                }, function () {
                    _this.autoPlay();
                });
            }
            if(this.opt.invoke > 1){
                this.invoke(this.navItem.eq(this.opt.invoke - 1));
            }
            this.event();
        },
        event: function () {
            var _this = this;
            var navItem = this.navItem;
            var opt = this.opt;
            if (opt.triggerType === 'click') {
                navItem.on(opt.triggerType, function () {
                    _this.invoke($(this));
                });
            } else if (opt.triggerType === 'mouseover' || opt.triggerType !== 'click') {
                navItem.mouseover(function () {
                    _this.invoke($(this));
                });
            }
        },
        invoke: function (el) {
            var index = el.index();
            el.addClass('active').siblings().removeClass('active');
            var effect = this.opt.effect;
            var contentItem = this.contentItem;
            if (effect === 'default') {
                contentItem.eq(index).addClass('current').siblings().removeClass('current');
            } else if (effect === 'fade') {
                contentItem.eq(index).fadeIn().siblings().fadeOut();
            }
            if(this.opt.auto){
                this.loop = index;
            }
            this.opt.afterFun && this.opt.afterFun('执行之后');
        },
        autoPlay: function () {
            var _this = this;
            var opt = this.opt;
            var navItem = this.navItem;
            var len = this.navItem.length;
            clearInterval(this.timer);
            this.timer = setInterval(function () {
                _this.loop++;
                if(_this.loop >= len){
                    _this.loop = 0;
                }
                navItem.eq(_this.loop).trigger(opt.triggerType);
            }, opt.auto);
        }
    };

    $.fn.extend({
        tab: function (opt) {
            new Tab(this, opt);
        }
    });

    window.Tab = Tab;
})(jQuery);







