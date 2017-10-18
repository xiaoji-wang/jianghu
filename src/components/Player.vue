<template>
  <div class="container">
    <div class="close">
      <router-link to="/world">关闭</router-link>
    </div>
    <ul>
      <li>王大明</li>
      <li>生命：100/100</li>
      <li>内力：100/100</li>
      <li>力量：1</li>
      <li>身法：1</li>
      <li>悟性：1</li>
    </ul>
    <br/>
    <ul>
      <li>攻击：1</li>
      <li>防御：1</li>
      <li>暴击：1</li>
      <li>攻速：1</li>
      <li>闪避：1</li>
      <li>命中：1</li>
    </ul>
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
