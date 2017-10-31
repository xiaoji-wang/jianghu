<template>
  <div class="container" style="background: #000;">
    <div class="roles">
      <div class="left">
        <div v-for="l in left" class="role" :id="'r'+l.id" :css="false">
          <div class="hp" :style="{width:refreshHp(l.id,'LEFT')}"></div>
          <div class="cd" :style="{width:refreshCD(l.id,'LEFT')}"></div>
          <div :class="{dead:l.hp<=0}">{{l.name}}</div>
        </div>
      </div>
      <div class="right">
        <div v-for="r in right" class="role" :id="'r'+r.id" :css="false">
          <div class="hp" :style="{width:refreshHp(r.id,'RIGHT')}"></div>
          <div class="cd" :style="{width:refreshCD(r.id,'RIGHT')}"></div>
          <div :class="{dead:r.hp<=0}">{{r.name}}</div>
        </div>
      </div>
    </div>
    <div class="buttonDiv" style="text-align: center;">
      <router-link to="/world/map" replace v-show="!refresh">逃跑</router-link>
      <router-link to="/world/map" replace v-show="refresh">返回</router-link>
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
        left: [{id: 1, name: '王大明', hp: 100, cd: 0, attackSpeed: 5, location: 'LEFT', attack: 50}],
        right: [
          {id: 2, name: '村民1', hp: 100, cd: 0, attackSpeed: 1, location: 'RIGHT', attack: 5},
          {id: 3, name: '村民2', hp: 100, cd: 0, attackSpeed: 3, location: 'RIGHT', attack: 5},
          {id: 4, name: '村民3', hp: 100, cd: 0, attackSpeed: -1, location: 'RIGHT', attack: 5}
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
      },
      refreshHp (id, location) {
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
        return r[0].hp + '%'
      }
    },
    mounted () {
      let bool = true
      let fn = () => {
        if (bool) {
          this.left.concat(this.right).filter((v) => {
            if (v.hp > 0) {
              return v
            }
          }).forEach((r) => {
            r.cd += (2 + r.attackSpeed / 10)
            if (r.cd >= 100) {
              bool = false
              r.cd = 0
              let alive = []
              if (r.location === 'LEFT') {
                alive = this.right.filter((v) => {
                  if (v.hp > 0) {
                    return v
                  }
                })
              } else {
                alive = this.left.filter((v) => {
                  if (v.hp > 0) {
                    return v
                  }
                })
              }
              if (alive.length > 0) {
                let target = alive[Math.floor(Math.random() * alive.length)]
                let e = document.getElementById('r' + r.id)
                let t = document.getElementById('r' + target.id)
                Velocity(e, {
                  left: (t.offsetLeft - e.offsetLeft) + 'px',
                  top: (t.offsetTop - e.offsetTop) + 'px'
                }, {
                  duration: 100,
                  complete: () => {
                    target.hp = target.hp - r.attack
                    Velocity(e, {left: 0, top: 0}, {
                      duration: 100,
                      complete: () => {
                        Velocity(t, {
                          left: '0.1rem'
                        }, {
                          loop: 3,
                          duration: 10,
                          complete: () => {
                            if (target.hp <= 0) {
                              target.cd = 0
                              if (alive.length === 1) {
                                this.refresh = false
                                window.console.info('stop')
                              }
                            }
                            bool = true
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
        if (this.refresh) {
          window.requestAnimationFrame(fn)
        }
      }
      fn()
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

  .dead {
    text-decoration: line-through;
    color: #666;
  }
</style>
