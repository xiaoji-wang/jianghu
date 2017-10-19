<template>
  <div style="height: 24.5rem;background: #000;position: relative;border: solid 0.1rem #333">
    <div class="row header">
      <div @click="$router.push('/role')">
        {{npc.name}}
      </div>
      <div style="color: #006400;">
        Lv：{{npc.level}}
      </div>
    </div>
    <div class="row desc">
      {{npc.description}}
    </div>
    <div class="operate">
      <a href="javascript:void(0)" @click="talk">交谈</a>
      <router-link v-if="npc.attack_able" to="/world/fight" replace>过招</router-link>
      <router-link to="/world/map" replace>返回</router-link>
    </div>
  </div>
</template>
<script>
  import {action} from './js/constant'
  export default {
    name: 'npc',
    data () {
      return {
        npc: {}
      }
    },
    methods: {
      talk () {
        this.$store.commit('consoles', this.npc.name + '：' + this.npc.word)
      }
    },
    mounted () {
      this.$ws(action.SELECTED_NPC, {id: this.$route.params.id}, (data) => {
        this.npc = data
      })
    }
  }
</script>
<style scoped>
  @import "css/map.css";
  @import "css/world.css";

  p {
    color: #fff;
  }

  a {
    width: 5rem;
    margin-bottom: 0.5rem;
  }

  .operate {
    width: 5rem;
    position: absolute;
    bottom: 2rem;
    left: 50%;
    margin-left: -2.5rem;
  }
</style>
