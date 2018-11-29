import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// TODO 別のいい場所で初期化させる
import './config/firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
