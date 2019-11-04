;(function ($) {
    var Rating = function (el, options) {
        this.$el = $(el);
        this.$item = this.$el.find('.rating-item');
        this.opts = $.extend({}, defaults, options);
        this.init();
    };

    Rating.prototype.init = function () {
        this.lightOn(this.opts.num);
        if (!this.opts.readOnly) {
            this.bindEvent();
        }
    };

    Rating.prototype.lightOn = function (num) {
        this.$item.each(function (index) {
            if(index < parseInt(num)){
                $(this).css('background-position', '0 -32px');
            }else{
                $(this).css('background-position', '0 0');
            }
        });
    };

    Rating.prototype.bindEvent = function () {
        var _this = this;
        this.$el.on('mouseover', '.rating-item', function () {
            _this.lightOn($(this).index() + 1);
        }).on('mouseout', function () {
            _this.lightOn(_this.opts.num);
        }).on('click', '.rating-item', function () {
            _this.opts.num = $(this).index() + 1;
            _this.lightOn(_this.opts.num);
        });
    };

    var defaults = {
        num: 0,
        readOnly: false
    };

    window.Rating = Rating;
})(jQuery);

