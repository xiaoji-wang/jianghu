// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import socket from './socket'
import animate from 'animate.css'

Vue.config.productionTip = false

// Vue.use(socket, {url: 'ws://114.215.97.130:8270/jianghu'})
// Vue.use(socket, {url: 'ws://127.0.0.1:8270/jianghu'})
Vue.use(socket, {url: 'ws://192.168.0.104:8270/jianghu'})

Vue.use(animate)

Vue.prototype.$action = {
  GET_MAP: 1,
  SELECTED_MAP: 2
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
