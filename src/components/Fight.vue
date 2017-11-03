<template>
  <div class="container" style="background: #000;">
    <div class="roles">
      <div class="left">
        <div v-for="l in left" class="role" :id="'r'+l.id" :css="false">
          <!--<div style="border: solid 0.01rem #fff">-->
          <div class="hp" :style="{width:refreshHp(l.id,'LEFT')}"></div>
          <!--</div>-->
          <!--<div style="border: solid 0.01rem #fff">-->
          <div class="ki" :style="{width:refreshKi(l.id,'LEFT')}"></div>
          <!--</div>-->
          <!--<div style="border: solid 0.01rem #fff">-->
          <div class="cd" :style="{width:refreshCD(l.id,'LEFT')}"></div>
          <!--</div>-->
          <div :class="{dead:l.hp<=0}" style="text-align: center;">{{l.name}}</div>
          <div class="hurt">{{hurt}}</div>
        </div>
      </div>
      <div class="right">
        <div v-for="r in right" class="role" :id="'r'+r.id" :css="false">
          <!--<div style="border: solid 0.01rem #fff">-->
          <div class="hp" :style="{width:refreshHp(r.id,'RIGHT')}"></div>
          <!--</div>-->
          <!--<div style="border: solid 0.01rem #fff">-->
          <div class="ki" :style="{width:refreshKi(r.id,'RIGHT')}"></div>
          <!--</div>-->
          <!--<div style="border: solid 0.01rem #fff">-->
          <div class="cd" :style="{width:refreshCD(r.id,'RIGHT')}"></div>
          <!--</div>-->
          <div :class="{dead:r.hp<=0}" style="text-align: center;">{{r.name}}</div>
          <div class="hurt">{{hurt}}</div>
        </div>
      </div>
    </div>
    <div class="buttonDiv" style="text-align: center;">
      <a href="javascript:void(0)" @click="escape" v-show="refresh">逃跑</a>
      <a href="javascript:void(0)" @click="escape" v-show="!refresh">返回</a>
    </div>
    <div class="text">
      <div v-for="s in consoles" style="margin: 0.1rem" v-html="s"></div>
    </div>
    <div class="result" style="display: flex;align-items: center;justify-content: center;">
      <div>
        <p style="text-align: center;font-size: 2em;margin-bottom: 2rem;">{{result}}</p>
        <div style="font-size: 0.8em;" v-show="win">
          <p>经验：10</p>
          <p>金钱：1</p>
          <p>掉落：无</p>
        </div>
      </div>
      <!--<div style="position: absolute;">-->
      <!--<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">-->
      <!--<line x1="50%" y1="100%" x2="50%" y2="90%" style="stroke:rgb(99,99,99);stroke-width:2">-->
      <!--<animate attributeName="y2" from="100%" to="0" begin="0;second.end" dur="2s" id="first"/>-->
      <!--<animate attributeName="y1" from="100%" to="0" begin="first.end" dur="2s" id="second"/>-->
      <!--</line>-->
      <!--</svg>-->
      <!--</div>-->
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
        result: '未知结果',
        win: false,
        consoles: [],
        left: [
          {id: 1, name: '主角', maxHp: 10, hp: 10, cd: 0, attackSpeed: 3, location: 'LEFT', attack: 4, ki: 8, maxKi: 8},
          {id: 5, name: '随从', maxHp: 10, hp: 10, cd: 0, attackSpeed: 2, location: 'LEFT', attack: 2, ki: 8, maxKi: 8}
        ],
        right: [
          {
            id: 2,
            name: '村民',
            maxHp: 10,
            hp: 10,
            cd: 0,
            attackSpeed: 4,
            location: 'RIGHT',
            attack: 2,
            ki: 20,
            maxKi: 20
          },
          {id: 3, name: '村民', maxHp: 10, hp: 10, cd: 0, attackSpeed: 10, location: 'RIGHT', attack: 1, ki: 8, maxKi: 8}
        ]
      }
    },
    methods: {
      escape () {
        this.refresh = false
        this.$router.replace({path: '/world/map'})
      },
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
      },
      refreshKi (id, location) {
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
        if (r[0].ki <= 0) {
          return 0
        }
        return Math.floor(r[0].ki / r[0].maxKi * 100) + '%'
      },
      attack (r, target, e, t, alive, fn) {
        let h = t.getElementsByClassName('hurt')[0]
        // 攻击
        Velocity(e, {
          left: (t.offsetLeft - e.offsetLeft) + 'px', top: (t.offsetTop - e.offsetTop) + 'px'
        }, {
          duration: 100,
          complete: () => {
            this.hurt = '-' + r.attack
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
          duration: 1000,
          complete: () => {
            let isOver = false
            if (target.hp <= 0) {
              target.cd = 0
              this.consoles.push(target.name + '已落败！')
              if (alive.length <= 1) {
                this.refresh = false
                isOver = true
                if (target.location === 'LEFT') {
                  this.result = '败北！'
                } else {
                  this.result = '获胜！'
                  this.win = true
                }
                Velocity(document.getElementsByClassName('result')[0], {top: 0}, [1500, 50])
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
      },
      heal (r, e, fn) {
        if (r.ki > 3) {
          let h = e.getElementsByClassName('hurt')[0]
          h.style.color = 'green'
          h.style.display = 'block'
          this.hurt = '+' + 3
          Velocity(h, {
            top: '-2rem', opacity: 0
          }, {
            duration: 1000,
            complete: () => {
              this.consoles.push(r.name + '运气疗伤，恢复了' + 3 + '点生命值。')
              h.style.color = 'red'
              h.style.display = 'none'
              h.style.top = 0
              h.style.opacity = 1
              this.hurt = 0
              r.ki -= 3
              r.hp += 3
              window.requestAnimationFrame(fn)
            }
          })
          return true
        }
        return false
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
            return v.hp > 0
          })
        } else {
          alive = this.left.filter((v) => {
            return v.hp > 0
          })
        }
        if (alive.length <= 0 || !this.refresh) {
          return
        }
        let target = alive[Math.floor(Math.random() * alive.length)]
        let e = document.getElementById('r' + r.id)
        let t = document.getElementById('r' + target.id)
        if (r.hp / r.maxHp > 0.4 || !this.heal(r, e, fn)) {
          this.attack(r, target, e, t, alive, fn)
        }
      }
      fn()
    },
    watch: {
      consoles: function () {
        this.$nextTick(() => {
          let text = document.getElementsByClassName('text')[0]
          text.scrollTop = text.scrollHeight
        })
      }
    }
  }
</script>

<style scoped>
  @import "css/fight.css";
</style>
