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
        return Math.floor(this.canvas.height / 5)
      },
      width () {
        return (Math.floor(this.lengthen * 0.866) << 1)
      },
      halfWidth () {
        return this.width >> 1
      },
      canvas () {
        return document.getElementById('canvas')
      },
      centerPixels () {
        return this.axisToPixels({x: 0, y: 0})
      }
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
//        let offsetX = 0
        if (this.pixelsPoint.offset.x !== Math.floor(this.w)) {
          if (this.pixelsPoint.offset.x < 0) {
            this.w -= 0.5
          } else if (this.pixelsPoint.offset.x > 0) {
            this.w += 0.5
          }
//          lx += this.w
//          this.pixelsPoint.offset.x--
//          offsetX = 100 - this.pixelsPoint.offset.x
        } else {
//          this.pixelsPoint.offset.x = 0
//          this.w = 0
        }
//        console.info(this.w)
        let quarterHeight = this.lengthen >> 1
        ctx.beginPath()
        ctx.moveTo(lx - this.halfWidth + this.w, ly - quarterHeight)
        ctx.lineTo(lx + this.w, ly - this.lengthen)
        ctx.lineTo(lx + this.halfWidth + this.w, ly - quarterHeight)
        ctx.lineTo(lx + this.halfWidth + this.w, ly + quarterHeight)
        ctx.lineTo(lx + this.w, ly + this.lengthen)
        ctx.lineTo(lx - this.halfWidth + this.w, ly + quarterHeight)
        ctx.lineTo(lx - this.halfWidth + this.w, ly - quarterHeight)
        if (ctx.isPointInPath(this.pixelsPoint.click.x, this.pixelsPoint.click.y)) {
          if (this.axisPoint.old.x !== x || this.axisPoint.old.y !== y) {
            this.axisPoint.old.x = x
            this.axisPoint.old.y = y
            this.pixelsPoint.offset.x = this.centerPixels.x - lx
            this.pixelsPoint.offset.y = this.centerPixels.y - ly
            this.centerPixels = {x: lx, y: ly}
//            console.info(this.pixelsPoint.offset.x + ',' + this.pixelsPoint.offset.y)
          }
          this.axisPoint.current.x = x
          this.axisPoint.current.y = y
          ctx.fillStyle = 'wheat'
          ctx.fill()
          ctx.fillStyle = 'black'
          ctx.fillText(text, lx + this.w, ly)
        } else {
          ctx.stroke()
          ctx.fillStyle = 'white'
          ctx.fillText(text, lx + this.w, ly)
        }
        ctx.closePath()
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
          for (let x = -3; x < 4; x++) {
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
          offset: {x: 0, y: 0},
          click: {x: 0, y: 0}
        },
        w: 0
      }
    }
  }
</script>
<style scoped></style>
