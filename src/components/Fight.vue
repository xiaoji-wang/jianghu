<template>
  <div class="container">
    <div class="roles">
      <div class="our" style="border-right:solid 0.1rem #444;">
        <div>
          <span>宠物</span>
          <span><span></span>王大明</span>
        </div>
        <div>
          <span>随从</span>
        </div>
        <div>
          <span>菜B随从</span>
        </div>
        <div>
          <span>乐色随从</span>
          <span>肉盾宠物</span>
        </div>
        <div>
          <span>随从</span>
        </div>
      </div>
      <div class="enemy">
        <div>
          <span>村民</span>
        </div>
        <div>
          <span>村长</span>
          <span>宠物</span>
        </div>
        <div>
          <span>村民</span>
        </div>
      </div>
    </div>
    <div class="buttonDiv" style="text-align: center;">
      <router-link to="/world/map" replace>逃跑</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fight',
    data () {
      return {
        msg: ''
      }
    }
  }
</script>

<style scoped>
  .roles {
    display: flex;
  }

  .our, .enemy {
    flex: 1;
    height: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: solid 0.1rem #444;
  }

  .our span, .enemy span {
    margin: 0 0 0 0.5rem;
    line-height: 3rem;
    color: #ccc;
    border-top: solid 0.1rem #cd0000;
  }

  .buttonDiv {
    height: 4.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  a {
    width: 5rem;
  }
</style>
