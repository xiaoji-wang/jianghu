// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueWebsocket from 'vue-websocket'

Vue.config.productionTip = false

Vue.use(VueWebsocket, 'ws://114.215.97.130:8270/jianghu', {
  reconnection: false
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
