function waterfall(parent, box) {
    var oParent = document.querySelector(parent);
    var aBoxs = oParent.querySelectorAll(box);
    // 获取元素的宽度（box的宽度是一致的，只取一个）
    var oBoxW = aBoxs[0].offsetWidth;
    // 计算共有多少列（页面宽度 / box宽度）
    var cols = Math.floor(document.documentElement.offsetWidth / oBoxW);
    oParent.style.cssText = 'width:' + oBoxW * cols + 'px';

    // 获取第一排所有box高度
    var hArr = [];
    for (var i = 0; i < aBoxs.length; i++) {
        if (i < cols) {
            hArr.push(aBoxs[i].offsetHeight);
        } else {
            var minH = Math.min.apply(null, hArr);
            var minIndex = hArr.indexOf(minH);
            aBoxs[i].style.position = 'absolute';
            aBoxs[i].style.top = minH + 'px';
            aBoxs[i].style.left = oBoxW * minIndex + 'px';
            hArr[minIndex] += aBoxs[i].offsetHeight;
        }
    }

    // 滚动加载
    var dataInt = {data: [{'src': '0.jpg'},{'src': '1.jpg'},{'src': '2.jpg'},{'src': '3.jpg'},{'src': '4.jpg'},{'src': '5.jpg'},{'src': '6.jpg'},{'src': '7.jpg'},{'src': '8.jpg'}]};
    document.onscroll = function () {
        if(scrollSlide(oParent, aBoxs)){
            for(var i=0;i<dataInt.data.length;i++){
                var box = document.createElement('div');
                box.className = 'box';
                box.innerHTML = '<div class="pic"><img src="images/'+dataInt.data[i].src+'" alt=""></div>';
                oParent.appendChild(box);
            }
            waterfall('.main', '.box');
            console.log('加载...');
        }else{
            console.log('滚动...');
        };
    };
};

// 是否滚动到底
function scrollSlide(oParent, aBoxs) {
    var lastBox = aBoxs[aBoxs.length - 1];
    var lastBoxTop = Math.floor(lastBox.offsetTop + lastBox.offsetHeight / 2);
    var winH = document.body.clientHeight || document.documentElement.clientHeight;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    return (lastBoxTop < winH + scrollTop) ? true : false;
};