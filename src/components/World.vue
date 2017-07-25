<template>
  <div style="height: 100%;">
    <div style="height: 20%;background: #111;color: #999;padding: 0 10px;position: relative;">
      <span style="line-height: 30px;">明大侠</span>
      <span></span>
      <span></span>
    </div>
    <div style="height: 40%;background: #111;">
      <canvas id="canvas" @click="move($event)"></canvas>
    </div>
    <div style="height: 40%;background: #111">
      <router-link to="/login">123</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'world2',
    computed: {
      lengthen () {
        return Math.floor(this.canvas.height >> 3)
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
        return {x: this.canvas.width >> 1, y: this.canvas.height >> 1}
      }
    },
    methods: {
      move (e) {
        this.isClick = true
        this.pixelsPoint.click.x = e.offsetX
        this.pixelsPoint.click.y = e.offsetY
      },
      axisToPixels (axis) {
        return {
          x: (this.canvas.width >> 1) + axis.x * this.width + (axis.y % 2 === 0 ? 0 : this.halfWidth),
          y: (this.canvas.height >> 1) + axis.y * ((this.lengthen << 1) - (this.lengthen >> 1))
        }
      },
      drawHexagon (ctx, x, y, text, forbid) {
        let pixels = this.axisToPixels({x: x, y: y})
        if (this.pixelsPoint.offset.x > 0) {
          this.pixelsPoint.offset.x -= 0.1
          this.axisPoint.old.x = 0
        }
        if (this.pixelsPoint.offset.x < 0) {
          this.pixelsPoint.offset.x += 0.1
          this.axisPoint.old.x = 0
        }
        let lx = pixels.x - this.pixelsPoint.offset.x
        let ly = pixels.y // + this.pixelsPoint.offset.y
        ctx.beginPath()
        this.drawLine(ctx, lx, ly)
        if (this.isClick && ctx.isPointInPath(this.pixelsPoint.click.x, this.pixelsPoint.click.y)) {
          if (!this.maps[y + 1].map[x + 3].forbid) {
            let tx = this.axisPoint.old.x - x
            let ty = this.axisPoint.old.y - y
            this.pixelsPoint.offset.x += (tx * this.width + (y % 2 === 0 ? 1 : -1) * (ty % 2 === 0 ? 0 : (this.width >> 1)))
            this.pixelsPoint.offset.y += ty * 1.5 * this.lengthen
            this.axisPoint.old.x = x
            this.axisPoint.old.y = y
            this.centerPixels.x = this.pixelsPoint.offset.x
          }
          this.isClick = false
        }
//        if (ctx.isPointInPath(this.centerPixels.x, this.centerPixels.y)) {
//          ctx.fillStyle = 'wheat'
//          ctx.fill()
//          this.drawText(ctx, 'black', lx, ly, text)
//        } else {
//          if (!forbid) {
//            ctx.fillStyle = 'gray'
//          } else {
//            ctx.fillStyle = '#111'
//          }
//          ctx.fill()
//          this.drawText(ctx, 'white', lx, ly, text)
//        }
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
        ctx.stroke()
      },
      drawText (ctx, color, x, y, text) {
        ctx.fillStyle = color
        ctx.fillText(text, x, y)
      },
      getMaps () {
        this.axios.get('/static/data.json').then((response) => {
          this.maps = response.data.maps
        })
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
      ctx.font = '14px Arial'
      let fn = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = -2; y < 3; y++) {
          for (let x = -4; x < 5; x++) {
            if (y === -2 || y === 2 || x === -4 || x === 4) {
              this.drawHexagon(ctx, x, y, '', true)
            } else {
              let name = this.maps.length === 0 ? '' : this.maps[y + 1].map[x + 3].name
              let forbid = this.maps.length === 0 ? true : this.maps[y + 1].map[x + 3].forbid
              this.drawHexagon(ctx, x, y, name, forbid)
            }
          }
        }
        window.requestAnimationFrame(fn)
      }
      this.getMaps()
      fn()
    },
    data () {
      return {
        isClick: false,
        maps: [],
        axisPoint: {
          old: {x: 0, y: 0}
        },
        pixelsPoint: {
          offset: {x: 0, y: 0},
          click: {x: 0, y: 0}
        }
      }
    }
  }
</script>
<style scoped>

</style>
