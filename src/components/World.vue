<template>
  <div style="height: 100%;background: url('/static/image/bg.jpg');position: relative;"
       @click="showRoleInfo = false">
    <div class="row header">
      <div class="name" @click="nameClick($event)">
        王大明
        <ul v-show="showRoleInfo" style="text-align: center;">
          <li>
            <router-link to="/role">资&nbsp;&nbsp;料</router-link>
          </li>
          <li>
            <router-link to="/">武&nbsp;&nbsp;功</router-link>
          </li>
          <li>
            <router-link to="/">背&nbsp;&nbsp;包</router-link>
          </li>
        </ul>
      </div>
      <div
        style="color: #333;text-align: center;line-height: 2.5rem;">
        -&nbsp;{{maps.name}}&nbsp;-
      </div>
      <div style="color: #ddd;position: absolute;right: 0.5rem;line-height: 2.5rem;top:0;">
        设置
      </div>
    </div>
    <div class="row desc">
      {{currentCell.desc}}
    </div>
    <div class="row map">
      <canvas id="canvas" @click="click($event)"></canvas>
    </div>
    <div class="row npc">
      <button v-if="!!n.name" v-for="n in currentCell.npc" @click="npcClick(n)">{{n.name}}</button>
    </div>
    <div class="row text" @click="showNpcOperation=false">
      <div v-for="s in console">{{s.name}}:{{s.word}}</div>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated tada"
      leave-active-class="animated bounceOutRight"
    >
      <div class="dialog" v-show="showNpcOperation">
        <!--<li v-for="o in currentNpc.operation" @click="npcOperationClick(o)">{{o.name}}</li>-->
        <p class="name">{{currentNpc.name}}</p>
        <p class="desc">{{currentNpc.desc}}</p>
        <p class="action">
          <button @click="npcTalk(currentNpc.id,currentNpc.name)">交谈</button>
        </p>
        <p class="action">
          <button>交易</button>
        </p>
      </div>
    </transition>
    <!--<div class="dialog_mask" v-show="showNpcOperation" @click="showNpcOperation=false"></div>-->
  </div>
</template>
<!--<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">-->
<script>
  export default {
    name: 'world',
    data () {
      return {
        refresh: true,
        isClick: false,
        showRoleInfo: false,
        showNpcOperation: false,
        currentNpc: {},
        console: [],
        maps: {name: '', size: {x: 7, y: 5}, cells: []},
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
        return 10
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
      },
      currentCell () {
        let center = this.getMapCellByAxis(0, 0)
        if (center) {
          return center
        }
        return {}
      }
    },
    methods: {
      click (e) {
        if (!this.isMove()) {
          this.isClick = true
          this.pixelsPoint.click.x = e.offsetX * this.getRatio(this.ctx)
          this.pixelsPoint.click.y = e.offsetY * this.getRatio(this.ctx)
        }
      },
      nameClick (event) {
        this.showRoleInfo = !this.showRoleInfo
        event.cancelBubble = true
      },
      npcClick (npc) {
        this.$ws(this.$action.NPC_SELECTED, {id: npc.id}, (data) => {
          this.currentNpc = data
          this.showNpcOperation = !this.showNpcOperation
        })
      },
      npcTalk (id, name) {
        this.$ws(this.$action.NPC_TALK, {id: id}, (data) => {
          data.name = name
          this.console.push(data)
        })
      },
//      npcOperationClick (operation) {
//        if (operation.type === 'print') {
//          this.console.push(operation.params)
//          let div = document.getElementById('text')
//          div.scrollTop = div.scrollHeight
//        } else if (operation.type === 'fight') {
//          this.$router.push('/fight')
//        }
//      },
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
      move (ctx, x, y) {
        if (this.isClick && ctx.isPointInPath(this.pixelsPoint.click.x, this.pixelsPoint.click.y)) {
          if (this.ableArrive(x, y)) {
            this.axisPoint.click = {x: x, y: y}
            this.pixelsPoint.offset = {
              x: (x * this.width + (y % 2 === 0 ? 0 : (this.axisPoint.current.y % 2 === 0 ? this.halfWidth : -this.halfWidth))),
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
          x: (this.canvas.width >> 1) + axis.x * this.width + (axis.y % 2 === 0 ? 0 : ((this.axisPoint.current.y % 2 === 0) ? this.halfWidth : -this.halfWidth)),
          y: (this.canvas.height >> 1) + axis.y * ((this.lengthen << 1) - this.quarterHeight)
        }
      },
      drawMap (ctx, x, y, cell) {
        let local = this.offset(x, y)
        ctx.beginPath()
        this.drawHexagon(ctx, local.x, local.y)
        this.move(ctx, x, y)
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
        if (ctx.isPointInPath(tx, ty)) {
          ctx.fillStyle = '#8FBFFF'
          ctx.fill()
          ctx.fillStyle = '#666'
          if (cell) {
            ctx.fillText(cell.name, px, py)
          }
        } else if (cell) {
//          if (this.ableArrive(x, y) && !this.isMove()) {
//            ctx.fillStyle = '#CCFFFF'
//          } else {
          ctx.fillStyle = '#CAE1FF'
//          }
          ctx.fill()
          ctx.fillStyle = '#666'
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
      getMaps () {
        this.$ws(this.$action.GET_MAP, {}, (data) => {
          this.maps.name = data.name
          this.maps.cells = data.cells
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
        this.ctx.strokeStyle = '#333'
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
          for (let y = -startY; y < endY; y++) {
            for (let x = -startX; x < endX; x++) {
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
    },
    watch: {
      console (v1, v2) {
        this.$nextTick(() => {
          let talks = document.getElementsByClassName('row text')[0]
          talks.scrollTop = talks.scrollHeight
        })
      }
    }
  }
</script>
<style scoped>
  @import "css/world.css";
</style>
