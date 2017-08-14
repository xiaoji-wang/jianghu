<template>
  <div id="app" style="height: 100%;">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  li{
    list-style-type: none;
  }

  button {
    outline: none;
    border: none;
    display: inline-block;
    font-size: 1rem;
    /*line-height: 1.5rem;*/
    border-radius: 0.3rem;
    margin: 0.3rem 0 0.3rem 0.3rem;
    padding: 0.1rem 0.4rem;
    background: #338E8E;
    color: white;
  }

  button:active {
    background: #114949;
  }
</style>
