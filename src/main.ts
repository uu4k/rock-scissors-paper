import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'babel-polyfill'

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.config.errorHandler = (err, vm, info) => {
  alert(err)
  console.log(err, vm, info)
  vm.$data.error = err.message
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
