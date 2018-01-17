import Vue from 'vue';
import Lodash from 'lodash'
import Vuelidate from 'vuelidate';
import Vue2Filters from 'vue2-filters'
import MyFilters from '@utils';

import App from './App.vue';

require('./styles/main.scss');

Vue.use(Vuelidate);
Vue.use(Vue2Filters);
Vue.use(MyFilters);

new App().$mount('#app');