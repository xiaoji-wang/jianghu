<template>
  <div style="height: 100%;background: #000;position: relative;">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <router-view></router-view>
    </transition>
    <div class="row text">
      <div v-for="s in consoles">{{s}}</div>
    </div>
    <!--<npc v-show="false"></npc>-->
  </div>
</template>
<script>
  import {mapState} from 'vuex'
//  import npc from './Npc.vue'
  export default {
    name: 'world',
//    data () {
//      return {
//        console: []
//      }
//    },
    computed: mapState([
      'consoles'
    ]),
    methods: {
//      click () {
//        if (this.$route.name === 'npc') {
//          this.$router.push('/world/map')
//        }
//      }
    },
//    components: {
//      'npc': npc
//    },
    mounted () {
      this.$router.push('/world/map')
    }
//    watch: {
//      consoles (v1, v2) {
//        this.$nextTick(() => {
//          let talks = document.getElementsByClassName('row text')[0]
//          talks.scrollTop = talks.scrollHeight
//        })
//      }
//    }
  }
</script>
<style scoped>
  @import "css/world.css";
</style>
