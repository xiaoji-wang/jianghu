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
      <div style="position: absolute;background: #444;transition: margin-top,margin-left 1s,1s;" :style="center">
        <div style="position: absolute;" v-for="i in (row * col)" :style="{left: left(i) + 'px', top: top(i) + 'px'}">
          <div class="hexagon hexagon1" :style="hexagon"
               :class="{current: current(i - 1 - Math.floor((i - 1) / col) * col, Math.floor((i - 1) / col))}"></div>
          <div class="hexagon hexagon2" :style="hexagon"
               :class="{current: current(i - 1 - Math.floor((i - 1) / col) * col, Math.floor((i - 1) / col))}"></div>
          <div class="hexagon" :style="hexagon"
               :class="{current: current(i - 1 - Math.floor((i - 1) / col) * col, Math.floor((i - 1) / col))}"
               @click="move(i - 1 - Math.floor((i - 1) / col) * col, Math.floor((i - 1) / col))">
            <span>{{i - 1 - Math.floor((i - 1) / col) * col}}, {{Math.floor((i - 1) / col)}}</span>
          </div>
        </div>
      </div>
      <div
        style="position: absolute;left: 50%;top: 50%;width: 34px;height: 40px;margin-top: -20px;margin-left: -17px;z-index: 2;border: solid 1px white;"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'world',
    methods: {
      top (i) {
        let y = Math.floor((i - 1) / this.col)
        return y * 1.5 * this.lengthen - y
      },
      left (i) {
        let y = Math.floor((i - 1) / this.col)
        let x = i - y * this.col - 1
        return (y % 2 === 0 ? x * this.width : x * this.width + this.width / 2) + x
      },
      move (x, y) {
        this.x = x
        this.y = y
      },
      current (x, y) {
        return x === this.x && y === this.y
      }
    },
    computed: {
      width () {
        return Math.round(this.lengthen / 0.57735) - 2
      },
      center () {
        return {
          top: '50%',
          left: '50%',
          marginTop: -1 * this.top(this.y * this.col + this.x + 1) - this.lengthen + 'px',
          marginLeft: -1 * (this.left(this.x + 1) + (this.y % 2 === 0 ? this.width / 2 : this.width)) + 'px'
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
        lengthen: 40,
        row: 10,
        col: 10,
        x: 5,
        y: 5
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

  .current {
    background: wheat;
  }
</style>
