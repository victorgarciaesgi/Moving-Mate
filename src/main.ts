import Vue from 'vue';
import { store } from '@store';
import Lodash from 'lodash'
import Vuelidate from 'vuelidate';
import { sync } from 'vuex-router-sync';
import router from './router';
import Vue2Filters from 'vue2-filters'
import MyFilters from '@utils';

import App from './App.vue';

require('./styles/main.scss');

Vue.use(Vuelidate);
Vue.use(Vue2Filters);
Vue.use(MyFilters);



sync(store, router);

new App().$mount('#app');