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
      if (state.consoles.length > 30) {
        state.consoles.splice(0, 1)
      }
      this._vm.$nextTick(() => {
        let talks = document.getElementsByClassName('row text')[0]
        talks.scrollTop = talks.scrollHeight
      })
    },
    setPlayerLocation (state, v) {
      state.player.x = v.x
      state.player.y = v.y
    }
  },
  getters: {},
  modules: {}
})
