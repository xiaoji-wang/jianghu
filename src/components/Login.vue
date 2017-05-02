<template>
  <div style="height: 120px;width: 104px;position: relative;">
    <router-link to="/">div</router-link>
    <router-link to="/world2">canvas</router-link>
    <div class="div div1"></div>
    <div class="div div2"></div>
    <div class="div div3"></div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .div {
    margin-top: 30px;
    position: absolute;
    height: 60px;
    width: 104px;
    border-left: 1px solid wheat;
    border-right: 1px solid wheat;
  }

  .div1 {
    transform: rotate(60deg);
  }

  .div2 {
    transform: rotate(120deg);
  }
</style>
