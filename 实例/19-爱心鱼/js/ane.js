var Ane = function (ctx, opt) {
    this.ctx = ctx
    this.opt = opt
    this.x = []
    this.h = []
    this.init()
    this.draw()
}

Ane.prototype.init = function () {
    for (var i = 0; i < this.opt.num; i++) {
        this.x[i] = i * 16 + Math.floor(Math.random() * 20)
        this.h[i] = 200 + Math.floor(Math.random() * 50)
        this.draw(this.x[i], this.h[i])
    }
    // console.log(this.x, this.h)
}

Ane.prototype.draw = function(x, h) {
    this.ctx.save()
    this.ctx.globalAlpha = 0.6
    this.ctx.beginPath()
    this.ctx.moveTo(x, this.opt.canH)
    this.ctx.lineTo(x, this.opt.canH - h)
    this.ctx.lineWidth = 20
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = '#3b154e'
    this.ctx.stroke()
    this.ctx.restore()
}