;(function ($) {
    function Slide(el, options) {
        this.el = $(el);
        this.options = $.extend({}, Slide.defaults, options);
        this.init();
    }

    Slide.defaults = {
        loop: false,
        positions: false,
        positionsClick: false,
        auto: false
    };

    Slide.prototype = {
        init: function () {
            var el = this.el;
            var options = this.options;

            this.index = 0;
            this.timer = null;
            this.$list = el.find('.list');
            this.$slide = this.$list.find('.slide');

            if (options.loop) {
                var cloneFirst = this.$slide.first().clone();
                this.$list.append(cloneFirst);
            }

            this.$next = el.find('.next');
            this.$prev = el.find('.prev');
            this.mainWidth = el.width();
            this.len = this.$list.find('.slide').length;
            this.$list.width(this.len * this.mainWidth);

            if (options.positions) {
                var t_len = 0;
                this.$positions = el.find('.positions');
                if(options.loop){
                    t_len = this.len - 1;
                }else{
                    t_len = this.len;
                }
                for (var i = 0; i < t_len; i++) {
                    this.$positions.append('<span></span>');
                }
                this.$positions.find('span').first().addClass('active');
                this.positionHover();
            }

            this.next();
            this.prev();

            if(options.auto){
                this.auto();
            }
        },
        next: function () {
            var _this = this;
            this.$next.click(function () {
                _this.index++;
                _this.move();
            });
        },
        prev: function () {
            var _this = this;
            this.$prev.click(function () {
                _this.index--;
                _this.move();
            });
        },
        hoverState: function () {
            var _this = this;
            this.el.hover(function () {
                clearInterval(_this.timer);
            }, function () {
                _this.auto();
            });
        },
        move: function () {
            var options = this.options;

            if (this.index === -1) {
                if (options.loop) {
                    this.$list.css('left', (this.len - 1) * -this.mainWidth);
                    this.index = this.len - 2;
                } else {
                    this.index = this.len - 1;
                }
            }

            if (this.index === this.len) {
                if (options.loop) {
                    this.$list.css('left', 0);
                    this.index = 1;
                } else {
                    this.index = 0;
                }
            }

            this.$list.stop().animate({'left': this.index * -this.mainWidth}, 500);
            if (options.positions) {
                if (this.index === this.len - 1 && options.loop) {
                    this.$positions.find('span').eq(0).addClass('active').siblings().removeClass('active');
                } else {
                    this.$positions.find('span').eq(this.index).addClass('active').siblings().removeClass('active');
                }
            }
        },
        auto: function () {
            var _this = this;
            var options = this.options;
            clearInterval(this.timer);
            this.timer = setInterval(function () {
                _this.index++;
                _this.move();
            }, options.auto);
            this.hoverState();
        },
        positionHover: function () {
            var _this = this;
            this.$positions.find('span').hover(function () {
                var currentIndex = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                _this.index = currentIndex;
                _this.move();
            });
        }
    };

    $.fn.extend({
        slide: function (options) {
            new Slide(this, options);
        }
    });

    window.Slide = Slide;
})(jQuery);