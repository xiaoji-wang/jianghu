<template>
  <div class="container" style="background: #000;">
    <div class="roles">
      <div class="left">
        <div v-for="l in left" class="role" :id="'r'+l.id" :css="false">
          <div class="hp" :style="{width:refreshHp(l.id,'LEFT')}"></div>
          <div class="cd" :style="{width:refreshCD(l.id,'LEFT')}"></div>
          <div :class="{dead:l.hp<=0}">{{l.name}}</div>
          <div class="hurt">-{{hurt}}</div>
        </div>
      </div>
      <div class="right">
        <div v-for="r in right" class="role" :id="'r'+r.id" :css="false">
          <div class="hp" :style="{width:refreshHp(r.id,'RIGHT')}"></div>
          <div class="cd" :style="{width:refreshCD(r.id,'RIGHT')}"></div>
          <div :class="{dead:r.hp<=0}">{{r.name}}</div>
          <div class="hurt">-{{hurt}}</div>
        </div>
      </div>
    </div>
    <div class="buttonDiv" style="text-align: center;">
      <router-link to="/world/map" replace v-show="refresh">逃跑</router-link>
      <router-link to="/world/map" replace v-show="!refresh">返回</router-link>
    </div>
    <div class="text">
      <div v-for="s in consoles" style="margin: 0.1rem" v-html="s"></div>
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
        hurt: 0,
//        s: '<div v-for="s in consoles" style="margin: 0.1rem"></div>',
        consoles: [],
        left: [
          {id: 1, name: '主角', maxHp: 10, hp: 10, cd: 0, attackSpeed: 3, location: 'LEFT', attack: 4},
          {id: 5, name: '跟班', maxHp: 10, hp: 10, cd: 0, attackSpeed: 2, location: 'LEFT', attack: 4}
        ],
        right: [
          {id: 2, name: '村民1', maxHp: 10, hp: 10, cd: 0, attackSpeed: 1, location: 'RIGHT', attack: 2}
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
        if (r[0].hp <= 0) {
          return 0
        }
        return Math.floor(r[0].hp / r[0].maxHp * 100) + '%'
      }
    },
    mounted () {
      this.consoles.push('主角一抱拳，朗声说道：“请赐教！”')
      let fn = () => {
        let bool = true
        let arr = this.left.concat(this.right)
        let r
        for (let i = 0; i < arr.length; i++) {
          r = arr[i]
          if (r.hp > 0) {
            r.cd += (1 + r.attackSpeed / 10)
            if (r.cd >= 100) {
              bool = false
              break
            }
          }
        }
        if (bool) {
          window.requestAnimationFrame(fn)
          return
        }
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
          let h = t.getElementsByClassName('hurt')[0]
          // 攻击
          Velocity(e, {
            left: (t.offsetLeft - e.offsetLeft) + 'px', top: (t.offsetTop - e.offsetTop) + 'px'
          }, {
            duration: 100,
            complete: () => {
              this.hurt = r.attack
              target.hp = target.hp - r.attack
              this.consoles.push(r.name + '对' + target.name + '使出了一招<span style="color: #388e8e;">【普通的一拳】</span>，造成了' + r.attack + '点伤害。')
            }
          })
          // 返回
          Velocity(e, {left: 0, top: 0}, {duration: 100})
          // 振动
          Velocity(t, {
            left: '0.1rem'
          }, {
            loop: 3,
            duration: 20,
            complete: () => {
              h.style.display = 'block'
            }
          })
          // 飘血
          Velocity(h, {
            top: '-2rem', opacity: 0
          }, {
            duration: 900,
            complete: () => {
              let isOver = false
              if (target.hp <= 0) {
                target.cd = 0
                this.consoles.push(target.name + '已落败！')
                if (alive.length <= 1) {
                  isOver = true
                }
              }
              if (!isOver) {
                h.style.display = 'none'
                h.style.top = 0
                h.style.opacity = 1
                this.hurt = 0
                window.requestAnimationFrame(fn)
              }
            }
          })
        } else {
          // TODO over
          this.refresh = false
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

  .hurt {
    position: absolute;
    color: red;
    text-align: center;
    width: 100%;
    font-size: 0.8em;
    font-weight: bold;
    top: 0rem;
    display: none;
  }

  .text {
    padding: 0.2rem;
    overflow-y: auto;
    font-size: 0.8em;
    color: #ccc;
    position: absolute;
    top: 24.5rem;
    bottom: 0;
    left: 0;
    right: 0;
    background: #222;
  }
</style>
