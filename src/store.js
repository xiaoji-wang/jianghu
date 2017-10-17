/**
 * Created by wxji on 2017-10-16.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player: {x: 4, y: 5},
    consoles: []
  },
  actions: {},
  mutations: {
    consoles (state, v) {
      state.consoles.push(v)
    }
  },
  getters: {},
  modules: {}
})
