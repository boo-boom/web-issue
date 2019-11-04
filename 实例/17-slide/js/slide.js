;(function(){
    function Slide(el, opts){
        this.el = document.querySelector(el);
        this.opts = extend(this.defaults, opts || {}, true);
        this.init();
    };

    Slide.prototype.defaults = {
        loop: false,
        positions: false,
        time: 200,
        type: 'linear'
    };

    Slide.prototype.init = function(){
        var self = this;
        var el = this.el;
        var opts = this.opts;

        this.index = 0;
        this.$list = el.querySelector('.list');
        this.$next = el.querySelector('.next');
        this.$prev = el.querySelector('.prev');
        if(opts.loop){
            var cloneFirst = this.$list.querySelectorAll('.slide')[0].cloneNode(true);
            this.$list.appendChild(cloneFirst);
        };
        this.$slide = this.$list.querySelectorAll('.slide');
        this.slideWidth = el.clientWidth;
        this.len = this.$slide.length;

        this.$list.style.width = this.slideWidth * this.len + 'px';
        this.$next.onclick = function(){
            self.next();
        };
        this.$prev.onclick = function(){
            self.prev();
        };
    };

    Slide.prototype.next = function(){
        this.index++;
        this.move();
    };

    Slide.prototype.prev = function(){
        this.index--;
        this.move();
    };

    Slide.prototype.move = function(){
        var self = this;
        
        if(this.opts.loop){
            if(this.index == this.len - 1){
                setTimeout(function(){
                    self.index = 0;
                    self.$list.style.transition = 'all 0ms';
                    self.$list.style.transform = 'translateX(0px)';
                }, this.opts.time);
            }
            if(this.index == -1){
                this.index = this.len - 2;
                this.$list.style.transition = 'all 0ms';
                this.$list.style.transform = 'translateX('+ (-this.slideWidth * (this.len - 1)) +'px)';
            }
        }else{
            if(this.index >= this.len - 1){
                this.index = this.len - 2;
                return;
            }
            if(this.index == -1){
                this.index = 0;
                return;
            }
        }
        setTimeout(function(){
            var x = parseInt(self.slideWidth) * self.index;
            self.$list.style.transition = 'all ' + self.opts.time + 'ms ' + self.opts.type;
            self.$list.style.transform = 'translateX('+(-x)+'px)';
        });
    };

    window.Slide = Slide;
})();

// 拷贝对象
function extend(){
    var args = arguments;
    if(!args.length) return;
    var obj = {};
    var deep = args[args.length-1];
    for(var i = 0; i < args.length; i++){
        var arg = args[i];
        for(var k in arg){
            obj[k] = arg[k];
            if(deep){
                var objStr = Object.prototype.toString.call(arg[k]);
                if(objStr == '[object Object]' || objStr == '[object Array]'){
                    for(var kk in arg[k]){
                        obj[k][kk] = arg[k][kk];
                    }
                }
            }
        }
    };
    return obj;
};

//var left = parseInt(document.defaultView.getComputedStyle(self.$list, null)['left']);

