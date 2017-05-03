<template>
  <div style="height: 100%;background: black;">
    <div style="height: 30%;">
      <router-link to="/login">123</router-link>
    </div>
    <div style="height: 40%;">
      <canvas id="canvas" @click="move($event)"></canvas>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'world2',
    computed: {
      lengthen () {
        return Math.floor(this.canvas.height / 6)
      },
      width () {
        return (Math.floor(this.lengthen * 0.866) << 1)
      },
      halfWidth () {
        return this.width >> 1
      },
      canvas () {
        return document.getElementById('canvas')
      }
//      centerPixels () {
//        return this.axisToPixels({x: 0, y: 0})
//      }
    },
    methods: {
      move (e) {
        this.pixelsPoint.click.x = e.offsetX
        this.pixelsPoint.click.y = e.offsetY
      },
      axisToPixels (axis) {
        return {
          x: (this.canvas.width >> 1) + axis.x * this.width + (axis.y % 2 === 0 ? 0 : this.halfWidth),
          y: (this.canvas.height >> 1) + axis.y * ((this.lengthen << 1) - (this.lengthen >> 1))
        }
      },
      drawHexagon (ctx, x, y, text) {
        let pixels = this.axisToPixels({x: x, y: y})
        let lx = pixels.x
        let ly = pixels.y
        if (this.pixelsPoint.offset.x !== Math.trunc(this.pixelsPoint.offset.tx)) {
          if (this.pixelsPoint.offset.x > 0) {
            this.pixelsPoint.offset.tx += 0.1
          } else if (this.pixelsPoint.offset.x < 0) {
            this.pixelsPoint.offset.tx -= 0.1
          }
          lx += this.pixelsPoint.offset.tx
        } else {
          lx += this.pixelsPoint.offset.x
        }
        if (this.pixelsPoint.offset.y !== Math.trunc(this.pixelsPoint.offset.ty)) {
          if (this.pixelsPoint.offset.y > 0) {
            this.pixelsPoint.offset.ty += 0.1
          } else if (this.pixelsPoint.offset.y < 0) {
            this.pixelsPoint.offset.ty -= 0.1
          }
          ly += this.pixelsPoint.offset.ty
        } else {
          ly += this.pixelsPoint.offset.y
        }
        ctx.beginPath()
        this.drawLine(ctx, lx, ly)
        if (ctx.isPointInPath(this.pixelsPoint.click.x + this.pixelsPoint.offset.tx, this.pixelsPoint.click.y)) {
          if (this.axisPoint.old.x !== x || this.axisPoint.old.y !== y) {
            let oldPixelsPoint = this.axisToPixels(this.axisPoint.old)
            this.pixelsPoint.offset.x += (oldPixelsPoint.x - lx)
            this.pixelsPoint.offset.y += (oldPixelsPoint.y - ly)
            this.axisPoint.old.x = x
            this.axisPoint.old.y = y
            console.info(this.pixelsPoint.offset.x + ',' + this.pixelsPoint.offset.y)
          }
          this.axisPoint.current.x = x
          this.axisPoint.current.y = y
          ctx.fillStyle = 'wheat'
          ctx.fill()
          this.drawText(ctx, 'black', lx, ly, text)
        } else {
          ctx.stroke()
          this.drawText(ctx, 'white', lx, ly, text)
        }
        ctx.closePath()
      },
      drawLine (ctx, x, y) {
        let quarterHeight = this.lengthen >> 1
        ctx.moveTo(x - this.halfWidth, y - quarterHeight)
        ctx.lineTo(x, y - this.lengthen)
        ctx.lineTo(x + this.halfWidth, y - quarterHeight)
        ctx.lineTo(x + this.halfWidth, y + quarterHeight)
        ctx.lineTo(x, y + this.lengthen)
        ctx.lineTo(x - this.halfWidth, y + quarterHeight)
        ctx.lineTo(x - this.halfWidth, y - quarterHeight)
      },
      drawText (ctx, color, x, y, text) {
        ctx.fillStyle = color
        ctx.fillText(text, x, y)
      }
    },
    mounted () {
      this.canvas.width = window.innerWidth
      this.canvas.height = this.canvas.parentNode.clientHeight
      let ctx = this.canvas.getContext('2d')
      this.pixelsPoint.click = {x: this.canvas.width >> 1, y: this.canvas.height >> 1}
      ctx.strokeStyle = 'wheat'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      let fn = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = -3; y < 4; y++) {
          for (let x = -4; x < 5; x++) {
            this.drawHexagon(ctx, x, y, x + ',' + y)
          }
        }
        window.requestAnimationFrame(fn)
      }
      fn()
    },
    data () {
      return {
        axisPoint: {
          old: {x: 0, y: 0},
          current: {x: 0, y: 0}
        },
        pixelsPoint: {
          offset: {x: 0, y: 0, tx: 0, ty: 0},
          click: {x: 0, y: 0}
        },
        w: 0
      }
    }
  }
</script>
<style scoped></style>
