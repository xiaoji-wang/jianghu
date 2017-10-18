<template>
  <div class="container">
    <div class="row header">
      <div @click="$router.push('/player')">
        王大明
      </div>
      <div
        style="color: #006400;text-align: center;">
        -&nbsp;{{maps.name}}&nbsp;-
      </div>
      <div>
        设置
      </div>
    </div>
    <div class="row desc">
      {{currentCell.description}}
    </div>
    <div class="row map">
      <canvas id="canvas" @click="click($event)"></canvas>
    </div>
    <div class="row npc">
      <button v-if="!!n.name" v-for="n in currentCell.npc" @click="selectNpc(n.id)">{{n.name}}</button>
    </div>
  </div>
</template>

<script>
  import {action} from './js/constant'
  export default {
    name: 'map',
    data () {
      return {
        refresh: true,
        isClick: false,
        npcs: [],
        maps: {name: '', size: {x: 8, y: 6}, cells: []},
        axisPoint: {
          click: {x: 0, y: 0},
          current: {x: 0, y: 0}
        },
        pixelsPoint: {
          offset: {x: 0, y: 0},
          target: {x: 0, y: 0},
          click: {x: 0, y: 0}
        }
      }
    },
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
      ctx () {
        return this.canvas.getContext('2d')
      },
      centerPixels () {
        return {x: this.canvas.width >> 1, y: this.canvas.height >> 1}
      },
      distanceX () {
        return 6
      },
      distanceY () {
        return this.distanceX * 1.73
      },
      currentCell () {
        let center = this.getMapCellByAxis(0, 0)
        if (center) {
          return center
        }
        return {}
      },
      player () {
        return this.$store.state.player
      }
    },
    methods: {
      getMaps () {
        this.$ws(action.GET_MAP, {}, (data) => {
          this.maps.name = data.name
          this.maps.cells = data.cells
//          this.screenRefresh()
//          this.refresh = false
        })
      },
      selectNpc (id) {
        this.$router.push({name: 'npc', params: {id: id}})
        this.$store.commit('setPlayerLocation', {
          x: this.player.x + this.axisPoint.current.x,
          y: this.player.y + this.axisPoint.current.y
        })
      },
      click (e) {
        if (!this.isMove()) {
          this.isClick = true
          this.pixelsPoint.click.x = e.offsetX * this.getRatio(this.ctx)
          this.pixelsPoint.click.y = e.offsetY * this.getRatio(this.ctx)
//          this.refresh = true
//          this.screenRefresh()
        }
      },
      isMove () {
        return this.pixelsPoint.offset.x !== 0 || this.pixelsPoint.offset.y !== 0
      },
      ableArrive (x, y) {
        let cell = this.getMapCellByAxis(x, y)
        if (!cell) {
          return false
        }
        if (this.currentCell.eOut && this.currentCell.eId === cell.id) {
          return true
        }
        if (this.currentCell.seOut && this.currentCell.seId === cell.id) {
          return true
        }
        if (this.currentCell.swOut && this.currentCell.swId === cell.id) {
          return true
        }
        if (this.currentCell.wOut && this.currentCell.wId === cell.id) {
          return true
        }
        if (this.currentCell.nwOut && this.currentCell.nwId === cell.id) {
          return true
        }
        if (this.currentCell.neOut && this.currentCell.neId === cell.id) {
          return true
        }
        return false
      },
      move (ctx, x, y) {
        if (this.isClick && ctx.isPointInPath(this.pixelsPoint.click.x, this.pixelsPoint.click.y)) {
          if (this.ableArrive(x, y)) {
            this.axisPoint.click = {x: x, y: y}
            this.pixelsPoint.offset = {
              x: x * this.width + (this.player.y % 2 === 0 ? 1 : -1) * (y % 2 === 0 ? 0 : (this.axisPoint.current.y % 2 === 0 ? this.halfWidth : -this.halfWidth)),
              y: y * 1.5 * this.lengthen
            }
            this.pixelsPoint.target.x += this.pixelsPoint.offset.x
            this.pixelsPoint.target.y += this.pixelsPoint.offset.y
            this.isClick = false
          }
        }
      },
      axisToPixels (axis) {
        return {
          x: (this.canvas.width >> 1) + axis.x * this.width + (this.player.y % 2 === 0 ? 1 : -1) * (axis.y % 2 === 0 ? 0 : ((this.axisPoint.current.y % 2 === 0) ? this.halfWidth : -this.halfWidth)),
          y: (this.canvas.height >> 1) + axis.y * ((this.lengthen << 1) - this.quarterHeight)
        }
      },
      drawMap (ctx, x, y, cell) {
        let local = this.offset(x, y)
        ctx.beginPath()
        this.drawHexagon(ctx, local.x, local.y)
        this.move(ctx, x, y, cell)
        this.drawText(ctx, local.x, local.y, x, y, cell)
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
      drawText (ctx, px, py, x, y, cell) {
        let tx = this.centerPixels.x + this.pixelsPoint.offset.x
        let ty = this.centerPixels.y + this.pixelsPoint.offset.y
        if (cell) {
          if (ctx.isPointInPath(tx, ty)) {
            ctx.fillStyle = '#333'
            ctx.fill()
            ctx.fillStyle = '#ccc'
          } else if (this.ableArrive(x, y) && !this.isMove() && this.refresh) {
            ctx.fillStyle = '#444'
            ctx.fill()
            ctx.fillStyle = '#ccc'
          } else {
            ctx.fillStyle = '#777'
          }
          ctx.fillText(cell.name, px, py)
        }
      },
      offset (x, y) {
        let pixels = this.axisToPixels({x: x, y: y})
        return {
          x: (pixels.x + this.pixelsPoint.offset.x - this.pixelsPoint.target.x),
          y: (pixels.y + this.pixelsPoint.offset.y - this.pixelsPoint.target.y)
        }
      },
      getMapCellByAxis (x, y) {
        let ty = this.axisPoint.current.y + y + this.player.y
        let tx = this.axisPoint.current.x + x + this.player.x
        if (ty < 0 || tx < 0 || this.maps.cells.length <= ty || this.maps.cells[0].length <= tx) {
          return null
        }
        return this.maps.cells[ty][tx]
      },
      getRatio (ctx) {
        let devicePixelRatio = window.devicePixelRatio || 1
        let backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
        return devicePixelRatio / backingStoreRatio
      },
      initCanvas () {
        this.canvas.width = window.innerWidth
        this.canvas.height = this.canvas.parentNode.clientHeight

        this.canvas.style.width = this.canvas.width + 'px'
        this.canvas.style.height = this.canvas.height + 'px'

        let ratio = this.getRatio(this.ctx)

        this.canvas.width = this.canvas.width * ratio
        this.canvas.height = this.canvas.height * ratio

        this.pixelsPoint.click = {x: this.canvas.width >> 1, y: this.canvas.height >> 1}
        this.ctx.strokeStyle = '#fff'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = 0.8 * ratio + 'em Arial'
      }
    },
    mounted () {
      this.initCanvas()
      let startY = Math.floor(this.maps.size.y / 2)
      let endY = Math.ceil(this.maps.size.y / 2)
      let startX = Math.floor(this.maps.size.x / 2)
      let endX = Math.ceil(this.maps.size.x / 2)
      let fn = () => {
        if (this.refresh) {
          if (this.pixelsPoint.offset.x < 0) {
            this.pixelsPoint.offset.x += (this.distanceX * (this.pixelsPoint.offset.y === 0 ? 2 : 1))
            if (this.pixelsPoint.offset.x > 0) {
              this.pixelsPoint.offset.x = 0
              this.refresh = false
            }
          }
          if (this.pixelsPoint.offset.x > 0) {
            this.pixelsPoint.offset.x -= (this.distanceX * (this.pixelsPoint.offset.y === 0 ? 2 : 1))
            if (this.pixelsPoint.offset.x < 0) {
              this.pixelsPoint.offset.x = 0
              this.refresh = false
            }
          }
          if (this.pixelsPoint.offset.y > 0) {
            this.pixelsPoint.offset.y -= this.distanceY
            if (this.pixelsPoint.offset.y < 0) {
              this.pixelsPoint.offset.y = 0
              this.refresh = false
            }
          }
          if (this.pixelsPoint.offset.y < 0) {
            this.pixelsPoint.offset.y += this.distanceY
            if (this.pixelsPoint.offset.y > 0) {
              this.pixelsPoint.offset.y = 0
              this.refresh = false
            }
          }
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
          for (let y = -startY; y <= endY; y++) {
            for (let x = -startX; x <= endX; x++) {
              this.drawMap(this.ctx, x, y, this.getMapCellByAxis(x, y))
            }
          }
        } else {
          this.pixelsPoint.offset = {x: 0, y: 0}
          this.pixelsPoint.target = {x: 0, y: 0}
          this.axisPoint.current.x += this.axisPoint.click.x
          this.axisPoint.current.y += this.axisPoint.click.y
          this.refresh = true
        }
        window.requestAnimationFrame(fn)
      }
      fn()
      this.getMaps()
    }
  }
</script>

<style scoped>
  @import "css/map.css";
  @import "css/world.css";
</style>
