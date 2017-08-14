<template>
  <div style="height: 100%;background: black;position: relative;" @click="showRoleInfo=false;showNpcOperation=false">
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
        style="color: green;text-align: center;line-height: 2.5rem;">
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
      <a v-for="n in currentCell.npc" @click="npcClick($event,n)">{{n.name}}</a>
    </div>
    <div id="text" class="row text">
      <div v-for="s in console">{{s}}</div>
    </div>
    <ul class="dialog" v-show="showNpcOperation">
      <li v-for="o in currentNpc.operation" @click="npcOperationClick(o)">{{o.name}}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'world',
    computed: {
      lengthen () {
        return Math.floor(this.canvas.height / 6)
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
      npcClick (event, npc) {
        this.currentNpc = npc
        this.showNpcOperation = !this.showNpcOperation
        event.cancelBubble = true
      },
      npcOperationClick (operation) {
        if (operation.type === 'print') {
          this.console.push(operation.params)
          let div = document.getElementById('text')
          div.scrollTop = div.scrollHeight
        } else if (operation.type === 'fight') {
          this.$router.push('/fight')
        }
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
        if (ctx.isPointInPath(this.centerPixels.x - this.pixelsPoint.offset.x, this.centerPixels.y - this.pixelsPoint.offset.y)) {
          ctx.fillStyle = '#388E8E'
          ctx.fill()
          ctx.fillStyle = 'black'
          if (cell) {
            ctx.fillText(cell.name, px, py)
          }
        } else if (cell) {
          if (this.ableArrive(x, y)) {
            ctx.fillStyle = '#B4EEB4'
          } else {
            ctx.fillStyle = '#CAE1FF'
          }
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
//        debugger
//        this.$socket.emit('change', {a: 1})
        let ws = new window.WebSocket('ws://localhost:8270/jianghu')
        let _this = this
        ws.onmessage = (e) => {
          let jsonData = JSON.parse(e.data)
          _this.maps.name = jsonData.name
          _this.maps.cells = jsonData.cells
        }
        ws.onopen = () => {
          ws.send(1)
        }
//        this.axios.get('/static/data.json').then((response) => {
//          this.maps.name = response.data.name
//          this.maps.cells = response.data.cells
//        })
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
        this.ctx.strokeStyle = '#388E8E'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = ratio + 'em Arial'
      }
    },
    socket: {
//      namespace: '/jianghu',
      events: {
        changed (msg) {
          window.console.log('Something changed: ' + msg)
        },
        connect () {
          window.console.log('Websocket connected to ' + this.$socket.nsp)
        },
        disconnect () {
          window.console.log('Websocket disconnected from ' + this.$socket.nsp)
        },
        error (err) {
          window.console.error('Websocket error!', err)
        }
      }
    },
    mounted () {
      this.initCanvas()
      let startY = Math.floor(this.maps.size.y / 2)
      let endY = Math.ceil(this.maps.size.y / 2)
      let startX = Math.floor(this.maps.size.x / 2)
      let endX = Math.ceil(this.maps.size.x / 2)
      let fn = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = -startY; y < endY; y++) {
          for (let x = -startX; x < endX; x++) {
            this.drawMap(this.ctx, x, y, this.getMapCellByAxis(x, y))
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
        showRoleInfo: false,
        showNpcOperation: false,
        currentNpc: {},
        console: [],
        maps: {name: '', size: {x: 9, y: 5}, cells: []},
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
  .row {
    position: absolute;
    left: 0;
    right: 0;
    border-top: solid 0.1rem #388E8E;
    border-left: solid 0.1rem #388E8E;
    border-right: solid 0.1rem #388E8E;
  }

  .row.header {
    height: 3rem;
  }

  .row.header div.name {
    border-right: solid 0.1rem #338E8E;
    color: rgb(221, 221, 221);
    position: absolute;
    left: 0.5rem;
    padding-right: 0.5rem;
    line-height: 2.5rem;
    outline: none;
  }

  .row.header div.name:hover ul {
    visibility: visible;
  }

  .row.header div.name ul {
    position: absolute;
    background: black;
    padding: 0.2rem 0.5rem;
    z-index: 9;
    width: 5rem;
    border: 0.1rem solid rgb(51, 142, 142);
    margin-top: -0.1rem;
    left: -0.5rem;
  }

  .row.desc {
    height: 5rem;
    color: #ddd;
    padding: 0 0.5rem;
    font-size: 14px;
    text-indent: 2em;
    top: 2.5rem;
  }

  .row.map {
    height: 10rem;
    top: 7.5rem;
  }

  .row.npc {
    height: 4rem;
    top: 17.5rem;
  }

  .row.text {
    bottom: 0;
    top: 21.5rem;
    border-bottom: solid 0.1rem #388E8E;
    color: #338E8E;
    padding: 0.2rem;
    overflow-y: auto;
  }

  .dialog {
    position: absolute;
    z-index: 999;
    border: solid 0.1rem #338E8E;
    width: 8rem;
    height: 10rem;
    background: black;
    color: #338E8E;
    left: 50%;
    top: 50%;
    margin-left: -4rem;
    margin-top: -5rem;
  }

  .dialog li {
    text-align: center;
    padding: 0.5rem;
  }

  a {
    display: inline-block;
    margin: 0.5rem;
    color: #338E8E;
    text-decoration: none;
  }

  button {
    width: 60px;
    margin: 10px 0 10px 10px;
  }

  canvas {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
