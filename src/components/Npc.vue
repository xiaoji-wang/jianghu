<template>
  <div style="height: 24.5rem;background: #000;position: relative;border: solid 0.1rem #333">
    <div class="row header">
      <div @click="$router.push('/role')">
        {{npc.name}}
      </div>
      <div style="color: #006400;">
        Lv：{{npc.level}}
      </div>
      <!--<div>返回</div>-->
    </div>
    <div class="row desc">
      {{npc.description}}
    </div>
    <div class="operate">
      <button @click="talk">交谈</button>
      <button v-if="npc.attack_able" @click="$router.push('/world/fight')">过招</button>
      <button @click="$router.push('/world/map')">返回</button>
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

  button {
    width: 5rem;
    margin-bottom: 0.5rem;
  }

  .operate {
    width: 6rem;
    text-align: center;
    position: absolute;
    bottom: 2rem;
    left: 50%;
    margin-left: -3rem;
    min-height: 6rem;
  }
</style>
