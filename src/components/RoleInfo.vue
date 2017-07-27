<template>
  <div style="width: 100%;height: 100%;top: 0;background: black;">
    <router-link to="/world">{{msg}}</router-link>
  </div>
</template>

<script>
  export default {
    name: 'roleInfo',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<style scoped>

</style>
