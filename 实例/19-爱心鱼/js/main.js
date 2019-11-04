document.body.onload = game;

var lastTime = 0, delTime = 0;

function game(){
    init()
    lastTime = new Date()
    // gameLoop()
}

function init(){
    var can1 = document.getElementById('canvas1')
    var ctx1 = can1.getContext('2d')
    var can2 = document.getElementById('canvas2')
    var ctx2 = can2.getContext('2d')
    var bgPic = new Image()
    bgPic.src = './img/background.jpg'
    bgPic.onload = function() {
        // 背景
        background(ctx2, {
            img: bgPic,
            dX: 0,
            dY: 0,
            dWidth: can1.width,
            dHeight: can1.height,
        })

        // 游戏元素
        var aneNum = 50
        new Ane(ctx2, {
            canH: can1.height,
            num: aneNum
        })
        new Fruit(ctx2, {
            aneNum: aneNum,
        }).draw()
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop)
    var nowTime = new Date()
    delTime = nowTime - lastTime
    lastTime = nowTime
    console.log('loop', delTime)
}
