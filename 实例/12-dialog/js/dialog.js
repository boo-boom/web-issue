;(function ($) {
    var Dialog = function (options) {
        this.isOption = $.isPlainObject(options);
        this.opt = $.extend({}, Dialog.defaults, options);
        this.init();
    };

    Dialog.defaults = {
        width: 'auto',
        height: 'auto',
        type: 'default',
        message: '',
        buttons: [
            {type: 'red', text: '提交'},
            {type: 'green', text: '取消'}
        ],
        delay: 2000,
        maskOpacity: 0.5
    };

    Dialog.prototype = {
        init: function () {
            this.body = $('body');
            this.$dialog = $('<div class="dialog-container">');
            this.$wrapper = $('<div class="dialog-wrapper">');
            this.$header = $('<div class="dialog-header">');
            this.$content = $('<div class="dialog-content">');
            this.$footer = $('<div class="dialog-footer">');
            this.create();
        },
        create: function () {
            var _this = this;
            var opt = this.opt;
            var body = this.body,
                dialog = this.$dialog,
                wrapper = this.$wrapper,
                header = this.$header,
                content = this.$content,
                footer = this.$footer;
            if(!this.isOption) {
                dialog.append(wrapper);
                wrapper.append(header.addClass('ok'));
                body.append(dialog);
            }else{
                dialog.append(wrapper);
                wrapper.append(header.addClass(opt.type));
                if(opt.message){
                    content.html(opt.message);
                }
                body.append(dialog);
            }
            console.log(opt.message);
        }
    };

    window.Dialog = Dialog;
})(jQuery);