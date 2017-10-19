<template>
  <div style="height: 100%;background: #000;position: relative;">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <keep-alive include="map">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <div class="row text">
      <div v-for="s in consoles">{{s}}</div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'world',
//    data () {
//      return {
//      }
//    },
    computed: mapState([
      'consoles'
    ]),
    methods: {
//      click () {
//      }
    }
//    mounted () {
//    }
  }
</script>
<style scoped>
  @import "css/world.css";
</style>
