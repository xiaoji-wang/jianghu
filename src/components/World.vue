<template>
  <div style="height: 100%;background: black;">
    <div style="height: 20%;position: relative;">
      <div @click='nameClick' style="color: #ddd;position: absolute;left: 5px;">
        王小明
      </div>
      <div style="color: green;position: absolute;left: 50%;width: 160px;margin-left: -80px;text-align: center;">
        -&nbsp;{{maps.name}}&nbsp;-
      </div>
      <div style="color: #ddd;position: absolute;right: 5px;">
        背包
      </div>
      <div style="color: #ddd;padding: 25px 5px 0;font-size: 14px;text-indent:2em;">
        这是一片深山，树木茂密，不时传来不知名的野兽的吼叫。你感觉到了一股莫名的危险。
      </div>
    </div>
    <div style="height: 40%;">
      <canvas id="canvas" @click="click($event)"></canvas>
    </div>
    <div style="height: 40%;">
      <img src="../assets/a.jpg">
    </div>
    <!--<div style="position: fixed;z-index: 999;top: 0;background: white;display: block;">-->
    <roleInfo style="position: absolute;z-index: 9;display: none;"></roleInfo>
    <!--</div>-->
  </div>
</template>
<script>
  import roleInfo from './RoleInfo'
  export default {
    name: 'world',
    components: {'roleInfo': roleInfo},
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
        return 0.1
      },
      distanceY () {
        return this.distanceX * 1.73
      },
      startMapCell () {
        for (let i = 0; i < this.maps.cells.length; i++) {
          if (this.maps.cells[i].startPoint) {
            return this.maps.cells[i]
          }
        }
        return null
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
      nameClick () {

      },
      isMove () {
        return this.pixelsPoint.offset.x !== 0 || this.pixelsPoint.offset.y !== 0
      },
      ableArrive (x, y) {
        if (!this.getMapCellByAxis(x, y)) {
          return false
        }
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
          if (cell) {
            ctx.fillText(cell.name, px, py)
          }
        } else if (cell) {
          ctx.fillStyle = '#CAE1FF'
          ctx.fill()
          ctx.fillStyle = 'black'
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
          this.maps.name = response.data.name
          this.maps.cells = response.data.cells
        })
      },
      getMapCellByAxis (x, y) {
        if (!this.startMapCell) {
          return null
        }
        for (let i = 0; i < this.maps.cells.length; i++) {
          let cell = this.maps.cells[i]
          if (cell.axisPoint.x === this.axisPoint.current.x + this.startMapCell.axisPoint.x + x && cell.axisPoint.y === this.axisPoint.current.y + this.startMapCell.axisPoint.y + y) {
            return cell
          }
        }
        return null
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
            this.drawMap(ctx, x, y, this.getMapCellByAxis(x, y))
          }
        }
        window.requestAnimationFrame(fn)
      }
      fn()
      this.getMaps()
    },
    data () {
      return {
        isClick: false,
        maps: {name: '', size: {x: 7, y: 5}, cells: []},
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
