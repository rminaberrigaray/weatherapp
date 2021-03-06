import VueDevtools from 'nativescript-vue-devtools'
import Vue from 'nativescript-vue'
import store from './store/store'
import App from './components/App'
import RadAutoComplete from 'nativescript-ui-autocomplete/vue';

Vue.use(RadAutoComplete);

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

Vue.registerElement('PullToRefresh', () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh);
  
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')


new Vue({
  store: store,
  render: h => h('frame', [h(App)])
}).$start()
