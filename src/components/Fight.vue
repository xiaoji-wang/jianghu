<template>
  <div class="container" style="background: #000;">
    <div class="roles">
      <div class="left">
        <div v-for="l in left" class="role" :id="'r'+l.id" :css="false">
          <div class="hp"></div>
          <div class="cd" :style="{width:refreshCD(l.id,'LEFT')}"></div>
          <div>{{l.name}}</div>
        </div>
      </div>
      <div class="right">
        <div v-for="r in right" class="role" :id="'r'+r.id" :css="false">
          <div class="hp"></div>
          <div class="cd" :style="{width:refreshCD(r.id,'RIGHT')}"></div>
          <div>{{r.name}}</div>
        </div>
      </div>
    </div>
    <div class="buttonDiv" style="text-align: center;">
      <router-link to="/world/map" replace>逃跑</router-link>
    </div>
    <div class="text">
      <!--<div v-for="s in consoles" style="margin: 0.1rem">{{s}}</div>-->
    </div>
  </div>
</template>

<script>
  import Velocity from 'velocity-animate'
  export default {
    name: 'fight',
    data () {
      return {
        refresh: true,
        left: [{id: 1, name: '王大明', hp: 10, cd: 0, attackSpeed: 5, location: 'LEFT'}],
        right: [
          {id: 2, name: '村民1', hp: 10, cd: 0, attackSpeed: 1, location: 'RIGHT'},
          {id: 3, name: '村民2', hp: 10, cd: 0, attackSpeed: -1, location: 'RIGHT'}
        ]
      }
    },
    methods: {
      refreshCD (id, location) {
        let arr
        if (location === 'LEFT') {
          arr = this.left
        } else {
          arr = this.right
        }
        let r = arr.filter((r) => {
          if (r.id === id) {
            return r
          }
        })
        return r[0].cd + '%'
      }
    },
    mounted () {
      let fn = () => {
        this.left.concat(this.right).forEach((r) => {
          r.cd += (0.5 + r.attackSpeed / 10)
          if (r.cd >= 100) {
            r.cd = 0
            let length = 8
            if (r.location !== 'LEFT') {
              length = -8
            }
            Velocity(document.getElementById('r' + r.id), {
              left: length + 'rem'
            }, {duration: 100}).then((v) => {
              Velocity(v, {left: '0rem'}, {duration: 100}).then((v) => {
                window.console.info(1)
              })
            })
          }
        })
        window.requestAnimationFrame(fn)
      }
      fn()
    },
    destroyed () {
      this.refresh = false
    }
  }
</script>

<style scoped>
  .roles {
    color: #ccc;
    display: flex;
  }

  .left, .right {
    flex: 1;
    height: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: solid 0.1rem #444;
  }

  .role {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .hp {
    background: #cd0000;
    height: 0.2rem;
  }

  .cd {
    background: #eeb422;
    height: 0.2rem;
    width: 0;
  }

  .buttonDiv {
    height: 4.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  a {
    width: 5rem;
  }
</style>
