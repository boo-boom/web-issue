;(function ($) {
    var interArr = [];

    function Countdown(allTime, func, i) {
        this.allTime = allTime;
        this.func = func;
        this.i = i ? i : 0;
        this.init();
    }

    Countdown.prototype.init = function () {
        this._format();
    };
    Countdown.prototype._format = function () {
        var _this = this;
        clearInterval(interArr[_this.i]);
        console.log(JSON.stringify(interArr));
        interArr[this.i] = setInterval(function () {
            if (this.allTime <= 0) {
                return false;
            } else {
                var px_d = 60 * 60 * 24,
                    px_h = 60 * 60,
                    px_m = 60;
                var d = _this._checkTime(Math.floor(_this.allTime / px_d)),
                    h = _this._checkTime(Math.floor((_this.allTime - d * px_d) / px_h)),
                    m = _this._checkTime(Math.floor((_this.allTime - d * px_d - h * px_h) / px_m)),
                    s = _this._checkTime(Math.floor(_this.allTime - d * px_d - h * px_h - m * px_m));
                if (_this.func) _this.func({
                    d: d,
                    h: h,
                    m: m,
                    s: s,
                    index: _this.i
                });
                //console.log(d + "天" + h + "小时" + m + "分" + s + "秒")
            }
            _this.allTime--;
        }, 1000);
    };
    Countdown.prototype._checkTime = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };
    $.extend({
        countdown: function (options, func, i) {
            new Countdown(options, func, i);
        }
    });
})(jQuery);
