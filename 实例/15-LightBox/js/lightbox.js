;(function ($) {
    var LightBox = function () {
        // 保存body
        this.bodyNode = $(document.body);
        // 创建遮罩和弹出层
        this.popupMask = $('<div id="G-lightbox-mask">');
        this.popupWin = $('<div id="G-lightbox-popup">');

        this.groupName = null;
        this.groupData = [];

        // 初始化
        this.init();
    };

    LightBox.prototype.init = function () {
        this.renderDOM();
        this.groupEvent();
    };

    LightBox.prototype.groupEvent = function () {
        var self = this;
        this.bodyNode.on('click', '.js-lightbox', function (e) {
            e.stopPropagation();
            var currentGroupName = $(this).attr('data-group');
            if (self.groupName !== currentGroupName) {
                self.groupName = currentGroupName;
                self.getGroup();
            }
            // 初始化弹窗
            self.initPopup($(this));
        });
    };

    LightBox.prototype.initPopup = function (currentObj) {
        var sourceSrc = currentObj.attr('data-source'),
            currentId = currentObj.attr('data-id');
        this.showMaskAndPopup(sourceSrc, currentId);
    };

    LightBox.prototype.showMaskAndPopup = function (sourceSrc, currentId) {
        console.log(sourceSrc, currentId);
    };

    LightBox.prototype.getGroup = function () {
        var self = this;
        var groupList = this.bodyNode.find('*[data-group='+ this.groupName +']');
        this.groupData.length = 1;
        groupList.each(function () {
            self.groupData.push({
                group: $(this).attr('data-group'),
                id: $(this).attr('data-id'),
                src: $(this).attr('src'),
                source: $(this).attr('data-source'),
                role: $(this).attr('data-role'),
                caption: $(this).attr('data-caption')
            });
        });
    };

    // 渲染剩余的DOM，并插入到body
    LightBox.prototype.renderDOM = function () {
        var strDom = '<div class="lightbox-pic-view">' +
            '<div class="lightbox-btn lightbox-prev-btn lightbox-prev-btn-show"></div>' +
            '<img class="lightbox-image" src="images/2-2.jpg" alt="">' +
            '<div class="lightbox-btn lightbox-next-btn lightbox-next-btn-show"></div>' +
            '</div>' +
            '<div class="lightbox-pic-caption">' +
            '<div class="lightbox-caption-area">' +
            '<p class="lightbox-pic-desc">图片标题</p>' +
            '<span class="lightbox-of-index">当前索引：1 of 4</span>' +
            '</div>' +
            '<span class="lightbox-close-btn"></span>' +
            '</div>';

        this.popupWin.html(strDom);
        this.bodyNode.append(this.popupMask);
        this.bodyNode.append(this.popupWin);

        // 获取dom
        this.picViewArea = this.popupWin.find('div.lightbox-pic-view');
        this.popupPic = this.popupWin.find('img.lightbox-image');
        this.picCaptionArea = this.popupWin.find('div.lightbox-pic-caption');
        this.prevBtn = this.popupWin.find('div.lightbox-prev-btn');
        this.nextBtn = this.popupWin.find('div.lightbox-next-btn');
        this.captionText = this.popupWin.find('p.lightbox-pic-desc');
        this.currentIdx = this.popupWin.find('span.lightbox-of-index');
        this.closeBtn = this.popupWin.find('span.lightbox-close-btn');
    };

    window.LightBox = LightBox;
})(jQuery);