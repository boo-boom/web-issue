var Fruit = function (ctx, opt) {
    this.ctx = ctx
    this.opt = opt
    this.num = 30 // 果实的数量
    this.alive = []
    this.x = []
    this.y = []
    this.imgs = [] // orgin blue
    this.imgPath = ['./img/fruit.png', './img/blue.png']
    this.init()
    this.born()
}

Fruit.prototype.init = function () {
    var that = this
    for (var i = 0; i < this.num; i++) {
        this.alive[i] = true
        this.x[i] = 0
        this.y[i] = 0
    }

    var imgNum = 0
    for (var i = 0; i < this.imgPath.length; i++) {
        this.imgs[i] = new Image()
        this.imgs[i].src = this.imgPath[i]
        console.log(imgNum, this.imgPath.length)
        this.imgs[i].onload = function () {
            imgNum++
            if (imgNum == this.imgPath.length) {
                console.log(imgNum)
            }
            
        }
    }

    // var imgNum = 0
    // for (var i = 0; i < this.imgs.length; i++) {
    //     this.imgs[i].onload = function () {
    //         if (imgNum == that.imgs.length - 1) {
    //             console.log(imgNum, that.imgs.length)
    //             that.draw()
    //         }
    //         imgNum++
    //     }
    // }


    // console.log(this.alive, this.x, this.y)
}

Fruit.prototype.draw = function () {
    for(var i = 0;i < this.num; i++) {}
    // this.ctx.drawImage(this.imgs[0], 0, 0)
}

Fruit.prototype.born = function () {

}