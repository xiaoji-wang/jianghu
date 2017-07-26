<template>
  <div style="height: 100%;background: black;">
    <div style="height: 30%;">
      <router-link to="/login">123</router-link>
    </div>
    <div style="height: 40%;">
      <canvas id="canvas" @click="click($event)"></canvas>
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
      quarterHeight () {
        return this.lengthen >> 1
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
      },
      distanceX () {
        return 0.2
      },
      distanceY () {
        return this.distanceX * 1.73
      }
    },
    methods: {
      click (e) {
        if (!this.isMove()) {
          this.isClick = true
          this.pixelsPoint.click.x = e.offsetX
          this.pixelsPoint.click.y = e.offsetY
        }
      },
      isMove () {
        return this.pixelsPoint.offset.x !== 0 || this.pixelsPoint.offset.y !== 0
      },
      ableArrive (x, y) {
        if (this.axisPoint.current.y % 2 === 0) {
          return x >= -1 && (x < 1 || (x === 1 && y === 0)) && y >= -1 && y <= 1
        }
        return x <= 1 && (x > -1 || (x === -1 && y === 0)) && y >= -1 && y <= 1
      },
      startMove (ctx, x, y) {
        if (this.isClick && ctx.isPointInPath(this.pixelsPoint.click.x, this.pixelsPoint.click.y)) {
          if (this.ableArrive(x, y)) {
            this.axisPoint.current.x += x
            this.axisPoint.current.y += y
            let tx = this.axisPoint.old.x - x
            let ty = this.axisPoint.old.y - y
            this.pixelsPoint.offset.x += (tx * this.width + (y % 2 === 0 ? 1 : -1) * (ty % 2 === 0 ? 0 : (this.axisPoint.current.y % 2 === 0 ? -(this.width >> 1) : (this.width >> 1))))
            this.pixelsPoint.offset.y += ty * 1.5 * this.lengthen
            this.axisPoint.old.x = x
            this.axisPoint.old.y = y
            this.isClick = false
          }
        }
      },
      axisToPixels (axis) {
        return {
          x: (this.canvas.width >> 1) + axis.x * this.width + (axis.y % 2 === 0 ? 0 : (this.axisPoint.current.y % 2 === 0 ? this.halfWidth : -this.halfWidth)),
          y: (this.canvas.height >> 1) + axis.y * ((this.lengthen << 1) - (this.lengthen >> 1))
        }
      },
      drawMap (ctx, x, y, cell) {
        let local = this.offset(x, y)
        ctx.beginPath()
        this.drawHexagon(ctx, local.x, local.y)
        this.startMove(ctx, x, y)
        this.drawText(ctx, local.x, local.y, cell)
        ctx.closePath()
      },
      drawHexagon (ctx, px, py) {
        ctx.moveTo(px - this.halfWidth, py - this.quarterHeight)
        ctx.lineTo(px, py - this.lengthen)
        ctx.lineTo(px + this.halfWidth, py - this.quarterHeight)
        ctx.lineTo(px + this.halfWidth, py + this.quarterHeight)
        ctx.lineTo(px, py + this.lengthen)
        ctx.lineTo(px - this.halfWidth, py + this.quarterHeight)
        ctx.lineTo(px - this.halfWidth, py - this.quarterHeight)
        ctx.stroke()
      },
      drawText (ctx, px, py, cell) {
        if (ctx.isPointInPath(this.centerPixels.x - this.pixelsPoint.offset.x, this.centerPixels.y - this.pixelsPoint.offset.y)) {
          ctx.fillStyle = '#388E8E'
          ctx.fill()
          ctx.fillStyle = 'black'
          ctx.fillText(cell.name, px, py)
        } else if (cell) {
          ctx.fillStyle = '#388E8E'
          ctx.fillText(cell.name, px, py)
        }
      },
      offset (x, y) {
        let pixels = this.axisToPixels({x: x, y: y})
        if (this.pixelsPoint.offset.x > 0) {
          this.pixelsPoint.offset.x -= (this.distanceX * (this.pixelsPoint.offset.y === 0 ? 2 : 1))
          if (this.pixelsPoint.offset.x < 0) {
            this.axisPoint.old.x = 0
            this.pixelsPoint.offset.x = 0
          }
        }
        if (this.pixelsPoint.offset.x < 0) {
          this.pixelsPoint.offset.x += (this.distanceX * (this.pixelsPoint.offset.y === 0 ? 2 : 1))
          if (this.pixelsPoint.offset.x > 0) {
            this.axisPoint.old.x = 0
            this.pixelsPoint.offset.x = 0
          }
        }
        if (this.pixelsPoint.offset.y > 0) {
          this.pixelsPoint.offset.y -= this.distanceY
          if (this.pixelsPoint.offset.y < 0) {
            this.axisPoint.old.y = 0
            this.pixelsPoint.offset.y = 0
          }
        }
        if (this.pixelsPoint.offset.y < 0) {
          this.pixelsPoint.offset.y += this.distanceY
          if (this.pixelsPoint.offset.y > 0) {
            this.axisPoint.old.y = 0
            this.pixelsPoint.offset.y = 0
          }
        }
        return {
          x: (pixels.x - this.pixelsPoint.offset.x),
          y: (pixels.y - this.pixelsPoint.offset.y)
        }
      },
      getMaps () {
        this.axios.get('/static/data.json').then((response) => {
          this.maps.cells = response.data.maps
        })
      }
    },
    mounted () {
      this.canvas.width = window.innerWidth
      this.canvas.height = this.canvas.parentNode.clientHeight
      let ctx = this.canvas.getContext('2d')
      this.pixelsPoint.click = {x: this.canvas.width >> 1, y: this.canvas.height >> 1}
      ctx.strokeStyle = '#388E8E'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '14px Arial'
      let startY = Math.floor(this.maps.size.y / 2)
      let endY = Math.ceil(this.maps.size.y / 2)
      let startX = Math.floor(this.maps.size.x / 2)
      let endX = Math.ceil(this.maps.size.x / 2)
      let fn = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = -startY; y < endY; y++) {
          for (let x = -startX; x < endX; x++) {
//            let name = (x + this.axisPoint.current.x) + ',' + (y + this.axisPoint.current.y)
            let cell = null
            let current = null
            this.maps.cells.forEach((c) => {
              if (c.current) {
                current = c
              }
            })
            if (current.axisPoint.x + this.axisPoint.current.x === x && current.axisPoint.y + this.axisPoint.current.y === y) {
              cell = current
            }
            this.drawMap(ctx, x, y, cell)
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
        maps: {size: {x: 7, y: 5}, cells: []},
        axisPoint: {
          old: {x: 0, y: 0},
          current: {x: 0, y: 0}
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
