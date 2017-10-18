import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import World from '@/components/World'
import Map from '@/components/Map'
import Npc from '@/components/Npc'
import Player from '@/components/Player'
import Fight from '@/components/Fight'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/', name: 'login', component: Login
  }, {
    path: '/world',
    name: 'world',
    component: World,
    children: [{
      path: 'map', name: 'map', component: Map
    }, {
      path: 'npc/:id', name: 'npc', component: Npc
    }, {
      path: 'fight', name: 'fight', component: Fight
    }]
  }, {
    path: '/player', name: 'player', component: Player
  }]
})
