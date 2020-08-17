import Vue from 'vue'
import App from './App.vue'

// vue-resources
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.options.root = 'https://ove-stock-trader.firebaseio.com/'


// a global filter
Vue.filter('currency', (value) => {
  return '$' +value.toLocaleString()
})


// store
import store from './store/store'


// setup routes
import VueRouter from 'vue-router'
import { routes } from './routes'
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history', // adjust URLs
  routes
  // husk <router-view></router-view> i App.vue

})


Vue.config.productionTip = false

new Vue({
  router, // bruker const ROUTER i appen nå.
  store,  // bruker imported store
  render: h => h(App),
}).$mount('#app')


