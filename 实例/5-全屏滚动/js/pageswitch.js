(function ($, win) {
    /*说明:获取浏览器前缀*/
    /*实现：判断某个元素的css样式中是否存在transition属性*/
    /*参数：dom元素*/
    /*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
    var _prefix = (function (temp) {
        var aPrefix = ["webkit", "moz", "o", "ms"],
            props = "";
        for (var i in aPrefix) {
            props = aPrefix[i] + "Transition";
            if (temp.style[props] !== undefined) {
                return "-" + aPrefix[i].toLowerCase() + "-";
            }
        }
        return false;
    })(document.createElement(PageSwitch));

    var PageSwitch = (function () {
        function PageSwitch(element, options) {
            this.element = element;
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
            this.init();
        }

        PageSwitch.prototype = {
            init: function () {
                var self = this;
                self.selectors = self.settings.selectors;
                self.sections = self.element.find(self.selectors.sections);
                self.section = self.sections.find(self.selectors.section);

                self.canScroll = true;
                self.direction = self.settings.direction === 'vertical' ? true : false;
                self.switchLength = self.direction ? self.element.height() : self.element.width();

                self.totalPages = self.section.length;
                self.index = (self.settings.index >= 0 && self.settings.index < self.totalPages) ? self.settings.index : 0;

                if (!self.direction || self.index) {
                    self._initLayout();
                }
                if (self.settings.pagination) {
                    self._initPaging();
                }
                self._initEvent();
            },
            /*上一页*/
            prev: function () {
                var self = this;
                if(self.index > 0){
                    self.index--;
                }else if(self.settings.loop && self.index === 0){
                    self.index = self.totalPages - 1;
                }
                self._scrollPage();
            },
            /*下一页*/
            next: function () {
                var self = this;
                if (self.index < self.totalPages - 1) {
                    self.index++;
                }else if(self.settings.loop && self.index >= self.totalPages - 1){
                    self.index = 0;
                }
                self._scrollPage();
            },
            /*横屏页面布局*/
            _initLayout: function () {
                var self = this;
                if(!self.direction){
                    var width = self.totalPages * 100 + '%',
                        cellWidth = (100 / self.totalPages).toFixed(2) + '%';
                    self.sections.css('width', width);
                    self.section.css({'width': cellWidth, 'float': 'left'});
                }
                if(self.index){
                    self._scrollPage(true);
                }
            },
            /*横屏分页布局*/
            _initPaging: function () {
                var self = this;
                var pageClass = self.selectors.page.substring(1),
                    html = '';
                html += '<div class=' + pageClass + '><ul>';
                for (var i = 0; i < self.totalPages; i++) {
                    html += '<li></li>';
                }
                html += '</ul></div>';
                self.element.append(html);

                var pages = self.element.find(self.selectors.page);
                self.activeClass = self.selectors.active.substring(1);
                self.pageItem = pages.find('li');
                self.pageItem.eq(self.index).addClass(self.activeClass);

                if(self.direction) {
                    pages.addClass('vertical');
                }else {
                    pages.addClass('herizontal');
                }
            },
            /*初始化插件事件*/
            _initEvent: function () {
                var self = this;
                self.element.on('mousewheel DOMMouseScroll', function (e) {
                    e.preventDefault();
                   var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                   if(self.canScroll){
                        if (delta > 0 && self.index) {
                            self.prev();
                        } else if (delta < 0 && self.index < (self.totalPages-1)) {
                            self.next();
                        }
                    }
                });
                /*分页点击控制*/
                if(self.settings.pagination){
                    self.pageItem.on('click',function () {
                        self.index = $(this).index();
                        self._scrollPage();
                    })
                }
                /*键盘控制*/
                if (self.settings.keyboard) {
                    $(win).keydown(function (e) {
                        var keyCode = e.keyCode;
                        if (keyCode === 37 || keyCode === 38) self.prev();
                        if (keyCode === 39 || keyCode === 40) self.next();
                    });
                }
                /*绑定窗口改变事件*/
                var resizeTimer = null;
                $(win).resize(function () {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                        var currentLength = self.switchLength,
                            offset = self.direction ? self.section.eq(self.index).offset().top : self.section.eq(self.index).offset().left;
                        if (Math.abs(offset) > currentLength / 2 && self.index < self.totalPages - 1) {
                            self.index++;
                        }
                        if (self.index) {
                            self._scrollPage();
                        }
                    }, 500);
                });
                /*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
                if (_prefix) {
                    self.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function () {
                        self.canScroll = true;
                        self.settings.callback && self.settings.callback();
                    });
                }
            },
            /*滑动动画*/
            _scrollPage: function (init) {
                var self = this;
                var dest = self.section.eq(self.index).position();
                if (!dest) return;

                self.canScroll = false;
                if (_prefix) {
                    var translate = self.direction ? 'translateY(-' + dest.top + 'px)' : 'translateX(-' + dest.left + 'px)';
                    self.sections.css(_prefix + 'transition', 'all ' + self.settings.duration + 'ms ' + self.settings.easing);
                    self.sections.css(_prefix + 'transform', translate);
                } else {
                    var animateCss = self.direction ? {top: -dest.top} : {left: -dest.left};
                    self.sections.animate(animateCss, self.settings.duration, function () {
                        self.canScroll = true;
                        self.settings.callback && self.settings.callback();
                    });
                }

                if(self.settings.pagination && !init){
                    self.pageItem.eq(self.index).addClass(self.activeClass).siblings('li').removeClass(self.activeClass);
                }
            }
        };
        return PageSwitch;
    })();
    $.fn.PageSwitch = function (options) {
        return this.each(function () {
            var self = $(this),
                instance = self.data('PageSwitch');
            if (!instance) {
                instance = new PageSwitch(self, options);
                self.data('PageSwitch', instance);
            }
            if ($.type(options) === 'string') return instance[options]();
        })
    };
    $.fn.PageSwitch.defaults = {
        selectors: {
            sections: '.sections',
            section: '.section',
            page: '.pages',
            active: '.active'
        },
        index: 5,
        easing: 'ease',
        duration: 500,
        loop: false,
        pagination: true,
        keyboard: true,
        direction: 'vertical',//herizontal
        callback: ''
    };

    $(function(){
        $('[data-PageSwitch]').PageSwitch();
    });
})(jQuery, window);