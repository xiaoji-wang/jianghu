<template>
  <div style="height: 100%;">
    <div style="height: 20%;">
      <router-link to="/login">123</router-link>
    </div>
    <div style="height: 50%;background: #666;">
      <canvas id="canvas" @click="move($event)"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'world2',
    computed: {
      width () {
        return Math.floor(this.lengthen * 0.866)
      }
    },
    methods: {
      move (e) {
        let canvas = this.getCanvas()
        this.current.x = Math.round((e.offsetX - (canvas.width >> 1)) / (this.width << 1))
        this.current.y = Math.round((e.offsetY - (canvas.height >> 1)) / (this.lengthen << 1))
        console.info(this.current)
      },
      drawHexagon (canvas, ctx, x, y, text) {
        let lx = (canvas.width >> 1) + x * (this.width << 1) + (y % 2 === 0 ? 0 : this.width)
        let ly = (canvas.height >> 1) + y * ((this.lengthen << 1) - (this.lengthen >> 1))
        let halfHeight = this.lengthen
        let quarterHeight = this.lengthen >> 1
        let halfWidth = this.width
        ctx.beginPath()
        ctx.moveTo(lx - halfWidth, ly - quarterHeight)
        ctx.lineTo(lx, ly - halfHeight)
        ctx.lineTo(lx + halfWidth, ly - quarterHeight)
        ctx.lineTo(lx + halfWidth, ly + quarterHeight)
        ctx.lineTo(lx, ly + halfHeight)
        ctx.lineTo(lx - halfWidth, ly + quarterHeight)
        ctx.lineTo(lx - halfWidth, ly - quarterHeight)
        if (this.current.x === x && this.current.y === y) {
          ctx.fillStyle = 'wheat'
          ctx.fill()
        } else {
          ctx.stroke()
        }
        ctx.closePath()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'black'
        ctx.fillText(text, lx, ly)
      },
      getCanvas () {
        return document.getElementById('canvas')
      }
    },
    mounted () {
      let canvas = this.getCanvas()
      canvas.width = window.innerWidth
      canvas.height = canvas.parentNode.clientHeight
      let ctx = canvas.getContext('2d')
      ctx.strokeStyle = 'wheat'
      let fn = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let y = -3; y < 4; y++) {
          for (let x = -3; x < 4; x++) {
            this.drawHexagon(canvas, ctx, x, y, x + ',' + y)
          }
        }
        window.requestAnimationFrame(fn)
      }
      fn()
    },
    data () {
      return {
        lengthen: 50,
        current: {x: 0, y: 0}
      }
    }
  }
</script>

<style scoped>

</style>
