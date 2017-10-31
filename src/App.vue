<template>
  <div id="app" style="height: 100%;">
    <keep-alive include="world">
      <router-view></router-view>
    </keep-alive>
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
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  li {
    list-style-type: none;
  }

  a {
    text-decoration: none;
    display: inline-block;
    font-size: 0.8em;
    outline: none;
    background: #444;
    color: #ccc;
    border: none;
    line-height: 1.8rem;
    text-align: center;
  }

  a:active {
    background: #333;
    transform: scale(0.95, 0.95);
  }

</style>
