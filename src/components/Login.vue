<template>
  <div style="height: 100%;background: black;position: relative;">
    <!--<router-link to="/world">步入江湖</router-link>-->
    <a @click="enter">步入江湖</a>
  </div>
</template>

<script>
  //  import {a} from './js/test'
  export default {
    name: 'login',
    data () {
      return {
        msg: ''
      }
    },
    methods: {
      enter () {
        this.$router.push('/world')
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
    top: 30%;
    position: relative;
    background: #338E8E;
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
