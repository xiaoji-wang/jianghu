<template>
  <div class="container">
    <div class="roles">
      <div class="our" style="border-right:solid 0.1rem #444;">
        <div v-for="r in our">
          <div class="role">
            <div class="hp"></div>
            <div class="cd" :style="{width:refreshOur(r.id)}"></div>
            <div>{{r.name}}</div>
          </div>
        </div>
      </div>
      <div class="enemy">
        <div v-for="e in enemy">
          <div class="hp"></div>
          <div class="cd" :style="{width:refreshEnemy(e.id)}"></div>
          <div>{{e.name}}</div>
        </div>
      </div>
    </div>
    <div class="buttonDiv" style="text-align: center;">
      <router-link to="/world/map" replace>逃跑</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fight',
    data () {
      return {
        refresh: true,
        our: [{id: 1, name: '王大明', hp: 10, cd: 100, attackSpeed: 2}],
        enemy: [
          {id: 2, name: '村民1', hp: 10, cd: 100, attackSpeed: 1},
          {id: 3, name: '村民2', hp: 10, cd: 100, attackSpeed: -1}
        ]
      }
    },
//    computed: {
//      styleObject () {
//        return '40%'
//      }
//    },
    methods: {
      refreshOur (id) {
        return this.our[0].cd + '%'
      },
      refreshEnemy (id) {
        let es = this.enemy.filter((e) => {
          if (e.id === id) {
            return e
          }
        })
        return es[0].cd + '%'
      }
    },
    mounted () {
      let fn = () => {
        let tr = null
        let te = null
        this.our.forEach((r) => {
          r.cd += (1 + r.attackSpeed / 10)
          if (r.cd >= 100) {
            tr = r
            r.cd = 0
          }
        })
        this.enemy.forEach((e) => {
          e.cd += (1 + e.attackSpeed / 10)
          if (e.cd >= 100) {
            te = e
            e.cd = 0
          }
        })
        if (tr != null) {
          this.$store.commit('consoles', tr.name + '打出了一招xxx，造成了x点伤害')
          window.setTimeout(fn, 500)
        } else if (te != null) {
          this.$store.commit('consoles', te.name + '打出了一招xxx，造成了x点伤害')
          window.setTimeout(fn, 500)
        } else if (this.refresh) {
          window.requestAnimationFrame(fn)
        }
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

  .our, .enemy {
    flex: 1;
    height: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: solid 0.1rem #444;
  }

  .role {
    display: inline-block;
  }

  .hp {
    background: #cd0000;
    height: 0.2rem;
  }

  .cd {
    background: #eeb422;
    height: 0.2rem;
  }

  /*.our div, .enemy span {*/
  /*margin: 0 0 0 0.5rem;*/
  /*line-height: 3rem;*/
  /*!*border-top: solid 0.1rem #cd0000;*!*/
  /*}*/

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
