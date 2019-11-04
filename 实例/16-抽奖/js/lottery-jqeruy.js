; (function ($) {
    function Lottery(el, options) {
        this.el = $(el);
        this.opt = $.extend({}, this.defaults, options, this.settings);

        this.init();
    };

    Lottery.prototype.defaults = {
        index: 0,
        delay: 20,
        cycle: 2,
        lotteryEnd: function () { }
    };

    Lottery.prototype.settings = {
        timer: null,
        totalStep: 0,
        isEnd: true,
        baseDelay: 20
    };
    // 初始化
    Lottery.prototype.init = function () {
        var _this = this;
        var el = this.el;
        var opt = this.opt;
        opt.baseDelay = this.opt.delay;
        this.$btn = el.find('.lottery-btn');
        this.$li = el.find('li');
        this.opt.totalStep = this.compontedStep();

        this.$li.eq(this.opt.index).addClass('active');
    };
    // 跑马灯
    Lottery.prototype.increase = function () {
        var _this = this;
        _this.opt.isEnd = false;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            _this.$li.eq(_this.opt.index).removeClass('active');
            _this.opt.index++;
            _this.opt.totalStep--;
            _this.opt.delay += 10;
            if (_this.opt.delay >= 1000) {
                _this.opt.delay = 1000;
            }
            console.log(_this.opt.index, _this.opt.totalStep);
            if (_this.opt.index == _this.$li.length) {
                _this.opt.index = 0;
            }
            _this.$li.eq(_this.opt.index).addClass('active');
            if (_this.opt.totalStep == 0) {
                clearTimeout(_this.timer);
                _this.opt.isEnd = true;
                _this.opt.lotteryEnd && _this.opt.lotteryEnd(_this.opt.index + 1);
                return false;
            }
            _this.increase();
        }, this.opt.delay);
    };
    // 计算需要走的步数
    Lottery.prototype.compontedStep = function () {
        return this.opt.cycle * this.$li.length;
    };
    // 随机数
    Lottery.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    // 开始抽奖
    Lottery.prototype.start = function () {
        if (this.opt.isEnd) {
            this.opt.delay = this.opt.baseDelay;
            var random = this.random(1, 12);
            console.log('奖品序号：' + random, '当前奖品：' + this.opt.index);
            this.opt.totalStep = this.compontedStep() + random - 1 - this.opt.index;
            this.increase();
            console.log('总共需要步数：' + this.opt.totalStep);
        }
    };

    window.Lottery = Lottery;

})(jQuery);