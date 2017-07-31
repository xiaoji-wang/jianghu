<template>
  <div class="container">
    <div class="close">
      <router-link to="/world">关闭</router-link>
    </div>
    王大明
    生辰
    生命
    内力
    力量
    身法
    悟性
  </div>
</template>

<script>
  export default {
    name: 'roleInfo',
    data () {
      return {
        msg: ''
      }
    }
  }
</script>

<style scoped>
  .container {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    background: black;
    border: solid 0.1rem #388E8E;
    color: #388E8E;
  }

  .close {
    position: absolute;
    border-left: solid 0.1rem #388E8E;
    border-bottom: solid 0.1rem #388E8E;
    width: 2.5rem;
    line-height: 2.5rem;
    right: 0;
    text-align: center;
  }

  a {
    color: #338E8E;
    text-decoration: none;
  }
</style>
