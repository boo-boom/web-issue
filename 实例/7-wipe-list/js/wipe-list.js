;(function ($) {
    var WipeList = (function () {
        function WipeList(el, opt) {
            this.el = el;
            this.opt = $.extend({}, $.fn.WipeList.defaults, opt);
            this.init();
        }

        WipeList.prototype = {
            init: function () {
                this.touchX = 0;
                this.moveX = 0;
                this.objX = 0;
                this.x = 0;
                this.delWidth = $(this.opt.deleteClass).outerWidth();
                this._touchLeft();
                this._touchEnd();
                //this._deleteEvent();
            },
            _touchLeft: function () {
                var _this = this;
                console.log(1);
                $(this.el).on('touchstart', function (e) {
                    _this.touchX = parseInt(e.targetTouches[0].clientX);
                    if (_this.objX === 0) {
                        $(this).on('touchmove', function (e) {
                            _this.moveX = parseInt(e.targetTouches[0].clientX);
                            _this.x = _this.moveX - _this.touchX;
                            _this.objX = ($(this)[0].style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;

                            if (_this.x >= 0) {
                                $(this).css({
                                    'transform': 'translateX(' + 0 + 'px)'
                                });
                            } else if (_this.x < 0) {
                                var l = Math.abs(_this.x);
                                $(this).css({
                                    'transform': 'translateX(' + -l + 'px)'
                                });
                                if (l > _this.delWidth) {
                                    l = _this.delWidth;
                                    $(this).css({
                                        'transform': 'translateX(' + -l + 'px)'
                                    });
                                }
                            }
                        });
                    } else if (_this.objX < 0) {
                        $(this).on('touchmove', function (e) {
                            _this.moveX = e.targetTouches[0].pageX;
                            _this.x = _this.moveX - _this.touchX;
                            if (_this.x >= 0) {
                                var r = -_this.delWidth + Math.abs(_this.x);
                                $(this).css({
                                    'transform': 'translateX(' + r + 'px)'
                                });
                                if (r > 0) {
                                    r = 0;
                                    $(this).css({
                                        'transform': 'translateX(' + r + 'px)'
                                    });
                                }
                            } else { //向左滑动
                                $(this).css({
                                    'transform': 'translateX(' + -_this.delWidth + 'px)'
                                });
                            }
                        });
                    }
                });
            },
            _touchEnd: function () {
                var _this = this;
                $(this.el).on('touchend', function (e) {
                    e.preventDefault();
                    _this.objX = ($(this)[0].style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                    if (_this.objX > -_this.delWidth / 2) {
                        $(this).css({
                            'transition': 'all 0.2s',
                            'transform': 'translateX(' + 0 + 'px)'
                        });
                        _this.objX = 0;
                    } else {
                        $(this).css({
                            'transition': 'all 0.2s',
                            'transform': 'translateX(' + -_this.delWidth + 'px)'
                        });
                        _this.objX = -_this.delWidth;
                    }
                })
            },
            _deleteEvent: function () {
                var _this = this;
                $(this.el).on('touchstart', this.opt.deleteClass, function () {
                    $(this).parent().remove();
                    console.log($(_this.opt.deleteClass).parent());
                    //_this.opt.deleteEvent && _this.opt.deleteEvent();
                });
            }
        };
        return WipeList;
    })();

    $.fn.WipeList = function (opt) {
        return this.each(function () {
            var self = $(this),
                instance = self.data('WipeList');
            if (!instance) {
                instance = new WipeList(self, opt);
                self.data('WipeList', instance);
            }
        });
    };

    $.fn.WipeList.defaults = {
        deleteClass: '.delete',
        deleteEvent: null
    }
})(jQuery);