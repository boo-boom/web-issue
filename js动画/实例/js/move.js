function startMove(obj, json, callback){
    var icurObj = {};
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var flag = true;
        for(var attr in json){
            icurObj[attr] = false;
            var icur = 0;
            if(attr == 'opacity'){
                icur = parseFloat(getStyle(obj, attr));                
            }else{
                icur = parseInt(getStyle(obj, attr));
            }
            var speed = (json[attr] - icur) / 10;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if(attr == 'opacity'){
                obj.style[attr] = icur + speed / 10;
            }else{
                obj.style[attr] = icur + speed + 'px';
            }
            if(icur == json[attr]){
                icurObj[attr] = true;
            }
            
            for(var k in icurObj){
                if(!icurObj[k]){
                    flag = false;
                    break;
                }
            }
            if(flag){
                clearInterval(obj.timer);
                callback && callback();
            }
        };
    }, 20);
};

function getStyle(obj, attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj, null)[attr];
    }
};