import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default  new Vuex.Store({
  state: {
    databases:[],
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations: {
    // put sychronous functions for changing state e.g. add, edit, delete
  },
  actions: {
    // put asynchronous functions that can call one or more mutation functions
  }
})

