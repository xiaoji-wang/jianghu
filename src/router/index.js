import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import World from '@/components/World'
import World2 from '@/components/World2'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/', name: 'world', component: World
  }, {
    path: '/world2', name: 'world2', component: World2
  }, {
    path: '/login', name: 'login', component: Login
  }]
})
