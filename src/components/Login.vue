<template>
  <div style="height: 100%;background: black;position: relative;">
    <router-link to="/world">步入江湖</router-link>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        msg: ''
      }
    }
  }
</script>

<style scoped>
  a {
    display: block;
    text-decoration: none;
    border-radius: 0.3rem;
    text-align: center;
    line-height: 2rem;
    color: white;
    width: 6rem;
    margin: 0 auto;
    top:30%;
    position: relative;
    background: #338E8E;
  }
</style>
