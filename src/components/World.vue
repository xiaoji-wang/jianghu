<template>
  <div style="height: 100%;">
    <div style="height: 20%;">
      <router-link to="/login">123</router-link>
      <select v-model="lengthen">
        <option value="20">20</option>
        <option value="40">40</option>
        <option value="60">60</option>
        <option value="80">80</option>
        <option value="100">100</option>
      </select>
    </div>
    <div style="height: 50%;overflow: hidden;position: relative;background: #888;">
      <div style="position: absolute;background: #444;" :style="center">
        <div style="position: absolute;" v-for="i in (row * col)" :style="{left: left(i),top: top(i)}"
             @click="move(i - 1 - Math.floor((i - 1) / col) * col, Math.floor((i - 1) / col))">
          <div class="hexagon hexagon1" :style="hexagon"></div>
          <div class="hexagon hexagon2" :style="hexagon"></div>
          <div class="hexagon" :style="hexagon">
            <span>{{i - 1 - Math.floor((i - 1) / col) * col}}, {{Math.floor((i - 1) / col)}}</span>
          </div>
        </div>
      </div>
      <div
        style="position: absolute;left: 50%;top: 50%;width: 34px;height: 40px;margin-top: -21px;margin-left: -18px;z-index: 2;border: solid 1px white;"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'world',
    methods: {
      top (i) {
        var y = Math.floor((i - 1) / this.col)
        return y * 1.5 * this.lengthen - y + 'px'
      },
      left (i) {
        var y = Math.floor((i - 1) / this.col)
        var x = i - y * this.col - 1
        return (y % 2 === 0 ? x * this.width : x * this.width + this.width / 2) + (x - 1) + 'px'
      },
      move (x, y) {
        this.x = x
        this.y = y
      }
    },
    computed: {
      width () {
        return Math.round(this.lengthen / 0.57735) - 2
      },
      center () {
        return {
          top: (this.row + 2 - this.y * 1.5) * this.lengthen + 'px',
//            this.y % 2 === 0 ? (this.row - this.y) * this.lengthen : (this.row - this.y) * this.lengthen - this.lengthen / 2 + 'px',
          left: (this.col - 2 - this.x * 2) * this.width + 'px'
//            this.x % 2 === 0 ? (this.col - this.x) * this.width - 2 * this.width : (this.col - this.x) * this.width - 2.5 * this.width + 'px'
//          width: (this.width + 1) * this.col + this.width / 2 + 'px',
//          height: (this.width - 2) * this.row + 'px'
//          marginLeft: this.y * this.width * -1 + 'px',
//          marginTop: this.x * this.lengthen * -1 + 'px'
        }
      },
      hexagon () {
        return {
          marginTop: this.lengthen / 2 + 'px',
          height: this.lengthen + 'px',
          width: this.width + 'px'
        }
      }
    },
    data () {
      return {
        lengthen: 20,
        row: 4,
        col: 6,
        x: 1,
        y: 1
      }
    }
  }
</script>

<style scoped>
  .hexagon {
    position: absolute;
    border-left: 1px solid wheat;
    border-right: 1px solid wheat;
  }

  .hexagon1 {
    transform: rotate(60deg);
  }

  .hexagon2 {
    transform: rotate(120deg);
  }
</style>
