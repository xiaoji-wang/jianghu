<template>
  <div style="width: 100%;height: 100%;top: 0;background: black;">
    <div class="close">
      <router-link to="/world">关闭</router-link>
    </div>
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
  .close {
    position: absolute;
    border: solid 0.1rem #388E8E;
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
